var xml = require("xml");

/**
 * Creates a <property> element with the given name and value
 *
 * @method createProperty
 * @param  {String} name    <property>'s name attribute
 * @param  {String} value   <property>'s value attribute
 * @return {Object}         The <property> element
 */
function createProperty(name, value) {
    return {
        property: [
            {
                _attr: {
                    name: name,
                    value: value
                }
            }
        ]
    };
}

/**
 * Creates a <failure> element with an failure message
 *
 * @method createFailure
 * @param message           result.error_message or result.status
 * @returns {Object}        The <failure> element
 */
function createFailure(message) {
    return {
        failure: [{ _attr: { message: message.split("\n").shift() } }, message]
    };
}

function isScenarioFailed(scenarioJson, scenarioOutput) {
    if (scenarioJson.steps) {
        const steps = scenarioJson.steps.filter(function (stepJson) {
            return stepJson.result.status === "failed";
        });

        if (steps && steps.length > 0) {
            scenarioOutput.push(createFailure(steps[0].result.error_message));

            return true;
        }
    }

    return false;
}

function isScenarioPendingOrUndefined(scenarioJson, scenarioOutput, options) {
    if (scenarioJson.steps) {
        const steps = scenarioJson.steps.filter(function (stepJson) {
            return stepJson.result.status === "pending" || stepJson.result.status === "undefined";
        });

        if (steps && steps.length > 0) {
            if (options.strict) {
                const result = steps[0].result || {};

                scenarioOutput.push(
                    createFailure(
                        result.status == "pending"
                            ? "Pending"
                            : "Undefined step. Implement with the following snippet:\n" +
                            "  this." +
                            steps[0].keyword.trim() +
                            "(/^" +
                            steps[0].name +
                            "$/, function(callback) {\n" +
                            "      // Write code here that turns the phrase above into concrete actions\n" +
                            "      callback(null, 'pending');\n" +
                            "  });"
                    )
                );
            }

            return true;
        }
    }

    return false;
}

function isScenarioSkipped(scenarioJson, scenarioOutput) {
    if (scenarioJson.steps) {
        const skippedSteps = scenarioJson.steps.filter(function (stepJson) {
            return stepJson.result.status === "skipped";
        });
        const allSteps = scenarioJson.steps;

        if (skippedSteps && allSteps && skippedSteps.length === allSteps.length) {
            scenarioOutput.push({
                skipped: [
                    {
                        _attr: {
                            message: ""
                        }
                    }
                ]
            });

            return true;
        }
    }

    return false;
}

function calculateDuration(scenarioJson) {
    if (scenarioJson.steps) {
        const total = scenarioJson.steps.reduce(function (total, stepJson) {
            if (stepJson.result.duration) {
                total = total + stepJson.result.duration / 1000;
            }

            return total;
        }, 0);

        return parseInt(total);
    }

    return 0;
}

function convertScenario(scenarioJson, options) {
    const scenarioOutput = [
        {
            _attr: {
                name: scenarioJson.name || scenarioJson.id,
                classname: scenarioJson.id,
                time: calculateDuration(scenarioJson)
            }
        }
    ];

    if (scenarioJson.steps) {
        if (isScenarioFailed(scenarioJson, scenarioOutput)) {
            return scenarioOutput;
        }

        if (isScenarioSkipped(scenarioJson, scenarioOutput)) {
            return scenarioOutput;
        }

        if (isScenarioPendingOrUndefined(scenarioJson, scenarioOutput, options)) {
            return scenarioOutput;
        }
    }

    return scenarioOutput;
}

function updateTestSuite(featureOutput, testcase) {
    featureOutput[0]._attr.tests += 1;

    // Check for errors and increment the failure rate
    if (testcase[1] && testcase[1].failure) {
        featureOutput[0]._attr.failures += 1;
    }

    if (testcase[1] && testcase[1].skipped) {
        featureOutput[0]._attr.skipped += 1;
    }

    if (testcase[0]) {
        featureOutput[0]._attr.time += testcase[0]._attr.time;
    }

    featureOutput.push({ testcase: testcase });
}

function createEmptyListTestCase(featureJson) {
    return [
        {
            _attr: {
                id: featureJson.id,
                name: featureJson.name,
                tests: 0,
                failures: 0,
                skipped: 0,
                time: 0
            }
        },
        {
            properties: []
        }
    ];
}

function convertTags(featureJson, featureOutput) {
    if (featureJson.tags) {
        featureJson.tags.forEach(function (tagJson) {
            const tag = typeof tagJson == "string" ? tagJson : tagJson.name;
            featureOutput[1].properties.push(createProperty(tag, true));
        });
    }
}

function convertProperties(featureJson, featureOutput) {
    if (featureJson.properties) {
        for (const propertyName in featureJson.properties) {
            if (featureJson.properties.hasOwnProperty(propertyName)) {
                featureOutput[1].properties.push(createProperty(propertyName, featureJson.properties[propertyName]));
            }
        }
    }
}

function convertUri(featureJson, featureOutput) {
    if (featureJson.uri) {
        featureOutput[1].properties.push(createProperty("URI", featureJson.uri));
    }
}

function convertListTestCase(featureJson, featureOutput, options) {
    const elements = featureJson.elements || [];

    elements
        .filter(function (scenarioJson) {
            return scenarioJson.type !== "background";
        })
        .forEach(function (scenarioJson) {
            var testcase = convertScenario(scenarioJson, options);

            updateTestSuite(featureOutput, testcase);
        });
}

function convertFeature(featureJson, options) {
    const featureOutput = createEmptyListTestCase(featureJson);

    if (options.prefix) {
        featureOutput[0]._attr.name = options.prefix + featureOutput[0]._attr.name;
    }

    convertTags(featureJson, featureOutput);

    convertProperties(featureJson, featureOutput);

    convertUri(featureJson, featureOutput);

    convertListTestCase(featureJson, featureOutput, options);

    return { testsuite: featureOutput };
}

/**
 * options:
 *  - indent - passed to the XML formatter, defaults to 4 spaces
 *  - stream - passed to the XML formatter
 *  - declaration - passed to the XML formatter
 *  - strict - if true, pending or undefined steps will be reported as failures
 *
 * @method exports
 * @param  {string} cucumberRaw  the Cucumber JSON report
 * @param  {object=} options     eg: {indent: boolean, strict: boolean, stream: boolean, declaration: {encoding: 'UTF-8'}}
 * @return {string} the JUnit XML report
 */
function cucumber_junit2(cucumberRaw, options) {
    let cucumberJson,
        output = [];
    options = options || {};
    if (options.indent === undefined) {
        options.indent = "    ";
    }
    if (!options.declaration) {
        options.declaration = { encoding: "UTF-8" };
    }

    if (cucumberRaw && cucumberRaw.toString().trim() !== "") {
        cucumberJson = JSON.parse(cucumberRaw);
        cucumberJson.forEach(function (featureJson) {
            if (featureJson.elements) {
                output = output.concat(convertFeature(featureJson, options));
            }
        });

        // If no items, provide something
        if (output.length === 0) {
            output.push({ testsuite: [] });
        }
    }

    // wrap all <testsuite> elements in <testsuites> element
    return xml({ testsuites: output }, options);
}

module.exports = cucumber_junit2;

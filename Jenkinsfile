node {   
    stage('check tools') {
        bat "node -v"
        bat "npm -v"
    }


    stage ('Checkout source code'){
      
         checkout scm
         bat '''
            echo "check source code sucessfully..."
        '''
    }

    stage('npm install') {

        bat "echo 'install dependencies'"
            
        bat "npm install --silent"
        
    }
    
    stage('Check webdriver server protractor version'){
        bat '''
            echo "start check protractor and webdriver version..."
        '''
        bat "protractor --version"
        //bat "webdriver-manager --version"
    }
    
    stage('Start webdriver'){
        bat '''
            echo "start webdriver..."
        '''
        bat "webdriver-manager start --ie --versions.standalone 3.4.0 --versions.ie 3.4.0"
        //bat "webdriver-manager --version"
    }

    stage('Run E2E testing') {
         bat '''
            echo "start run automation test..."
        '''
        bat "npm run e2e"
    }


    stage('Finished e2e testing...') {
        bat '''
            echo "finished..."
        '''
        archive (includes: 'pkg/*.gem')
         bat '''
            echo "archive the built artifacts..."
        '''
        publishHTML([
            allowMissing: false, 
            alwaysLinkToLastBuild: false, 
            includes: '**/*.html', 
            keepAll: true, 
            reportDir: '.tmp/report', 
            reportFiles: 'index.html', 
            reportName: 'Test Reports', 
            reportTitles: 'Automation Test Result'])

		bat '''
            echo "publish report sucessfully..."
        '''
        
    }
    
}
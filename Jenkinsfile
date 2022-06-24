def projectName = "retailhub-fe"
def branchName1 = "preprod"
def branchName2 = "developement"
def dirName = "${projectName}"
def osUser = "ubuntu"
def ipAddr = ""
def agentName = ""

pipeline {
    options {
        buildDiscarder(logRotator(numToKeepStr: "7"))
    }
    agent {
        docker {
            image "node:16"
            args "-v /usr/share/nginx/html/${dirName}:/var/empty2 -v /root/dcompose/${dirName}:/var/empty"
        }
    }
    stages {
        stage("Build")
        {
            steps
            {
                sh "npm --version"
                sh "node --version"
                echo "npm install --no-optional"
                script {
                    if (env.BRANCH_NAME == "${branchName2}")
                    {
                        sh "ls"
                        sh "npm run build"
                    }else if (env.BRANCH_NAME == "${branchName1}")
                    {
                        sh "npm run build"
                    }

                }
            }
        }

        stage("Deploy")
        {
            steps
            {
                script {
                    if (env.BRANCH_NAME == "${branchName2}")
                    {
                        echo "Deleting the old build.  "
                        sh "rm -r /var/empty2/* || ls"
                        echo "Old build deleted, Deploying new build"
                        sh "cp -a build/. /var/empty2/"
                        echo "Build Deployed. "
                    }else if (env.BRANCH_NAME == "${branchName1}")
                    {   
                        echo "Deleting the old build.  "
                        sh "rm -r /var/empty2/* || ls"
                        echo "Old build deleted, Deploying new build"
                        sh "cp -a build/. /var/empty2/"
                        echo "Build Deployed. "
                    }
                
                }
            }
            
        }
    }
    post { 
        always { 
            if ( buildResult == "SUCCESS" ) {
 	            slackSend color: "good", message: "Job: ${env.JOB_NAME} with buildnumber ${env.BUILD_NUMBER} was successful"
            }
            else if( buildResult == "FAILURE" ) { 
                slackSend color: "danger", message: "Job: ${env.JOB_NAME} with buildnumber ${env.BUILD_NUMBER} was failed"
            }
            else if( buildResult == "UNSTABLE" ) { 
                slackSend color: "warning", message: "Job: ${env.JOB_NAME} with buildnumber ${env.BUILD_NUMBER} was unstable"
            }
            else {
            slackSend color: "danger", message: "Job: ${env.JOB_NAME} with buildnumber ${env.BUILD_NUMBER} its resulat was unclear"	
            }
            cleanWs()
        }
    }
}

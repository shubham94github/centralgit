def projectName = "retailhub-fe"

def branchNameDev = "developement_wip"
def branchNamePreprod = "preprod"
def branchNameProd = "production"

def dirName = "${projectName}"
def osUser = "ubuntu"
def ipAddr = ""
def agentName = ""
def COLOR_MAP = [
    'SUCCESS': 'good', 
    'FAILURE': 'danger',
]

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
                    if (env.BRANCH_NAME == "${branchNameDev}")
                    {
                        load "$JENKINS_HOME/.env.development"
                        echo "${env.SERVER_URL}"
echo "${env.FILE_UPLOADER_URI}"
echo "${env.OAUTH_SERVER_URL}"
echo "${env.MESSAGES_SERVER_URL}"
echo "${env.ADMIN_SERVER_URL}"
echo "${env.WEBSOCKET_SERVER_URL}"
echo "${env.APP_NAME}"
echo "${env.CLIENT_ID}"
echo "${env.CLIENT_SECRET}"
echo "${env.STRIPE_LICENCE_KEY}"
echo "${env.CMS_URL}"
                        sh "npm run build:development"
                    }else if (env.BRANCH_NAME == "${branchNamePreprod}")
                    {
                        sh "npm run build"
                    }else if (env.BRANCH_NAME == "${branchNameProd}")
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
                    if (env.BRANCH_NAME == "${branchNameDev}")
                    {
                        echo "Deleting the old build.  "
                        sh "rm -r /var/empty2/* || ls"
                        echo "Old build deleted, Deploying new build"
                        sh "cp -a build/. /var/empty2/"
                        echo "Build Deployed. "
                    }else if (env.BRANCH_NAME == "${branchNamePreprod}")
                    {   
                        echo "Deleting the old build.  "
                        sh "rm -r /var/empty2/* || ls"
                        echo "Old build deleted, Deploying new build"
                        sh "cp -a build/. /var/empty2/"
                        echo "Build Deployed. "
                    }else if (env.BRANCH_NAME == "${branchNameProd}")
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
            //slackSend channel: 'deployments', color: COLOR_MAP[currentBuild.currentResult], message: "*Job*: ${env.JOB_NAME} (${env.BUILD_URL}console) \n *Build Number:* ${env.BUILD_NUMBER} \n *Status: ${currentBuild.currentResult}*"  
        	cleanWs()
        }
    }
}

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
                sh "npm install --no-optional"
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
            cleanWs()
            slackSend baseurl: 'https://hooks.slack.com/services/',
            channel: 'deployments',
            color: 'good',
            message: "*Job*: ${env.JOB_NAME} (${env.BUILD_URL}console) \n *Build Number:* ${env.BUILD_NUMBER} \n *Image Tag:* ${imageTag} \n *Status: SUCCESSFULL* ",
            teamDomain:'devops',
            tokenCredentialId:'Slack-Token'
        catch (Exception err) {
            slackSend baseurl: 'https://hooks.slack.com/services/',
            channel: 'deployments',
            color: 'danger',
            message: "*Job*: ${env.JOB_NAME} (${env.BUILD_URL}console) \n *Build Number:* ${env.BUILD_NUMBER} \n *Image Tag:* ${imageTag} \n *Status: FAILED*",
            teamDomain:'devops',
            tokenCredentialId:'Slack-Token'
            System.exit(1)
        }
        }
    }
}

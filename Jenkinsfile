def project_name = 'retailhub-fe'
def production_branch = 'production'
def beta_branch = 'preprod'
def development_branch = 'developement_wip'
def COLOR_MAP = [
  'SUCCESS': 'good',
  'FAILURE': 'danger',
]
if (env.BRANCH_NAME == "${development_branch}") {
  agentName = 'RetailhubDev'
  ip_address = 'dev1.retailhub.ai'
  user = 'mehulbudasna'
  deploy_path = '/usr/share/nginx/html/retailhub-fe'
}
if (env.BRANCH_NAME == "${beta_branch}") {
  agentName = 'RetailhubPreProd'
  ip_address = 'beta.retailhub.ai'
  user = 'mehulbudasna'
  deploy_path = '/usr/share/nginx/html/retailhub-fe'
}
if (env.BRANCH_NAME == "${production_branch}") {
  agentName = 'RetailhubProd'
  ip_address = 'app.retailhub.ai'
  user = 'mehulbudasna'
  deploy_path = '/usr/share/nginx/html/retailhub-fe'
}

pipeline {

  agent any
  options {
    buildDiscarder(logRotator(numToKeepStr: "7"))
  }

  stages {

    stage("Build") {
      agent {
        docker {
          image "node:16"
        }
      }
      steps {
        script {
          if (env.BRANCH_NAME == "${development_branch}") {
            sh "npm install"
            sh "CI='false' npm run build:development"
            stash includes: 'build/**/*', name: 'BUILD'
          } else if (env.BRANCH_NAME == "${beta_branch}") {
            sh "npm install"
            sh "CI='false' npm run build:staging"
            stash includes: 'build/**/*', name: 'BUILD'
          } else if (env.BRANCH_NAME == "${production_branch}") {
            sh "npm install"
            sh "CI='false' npm run build:production"
            stash includes: 'build/**/*', name: 'BUILD'
          }
        }
      }
    }

    stage("Deploy") {
      steps {
        script {
          unstash 'BUILD'
          sshagent(["${agentName}"]) {
            sh "ls build"
            sh "apt update && apt -y install rsync"
            sh "rsync -avrHP -e 'ssh -o StrictHostKeyChecking=no' --delete build/ ${user}@${ip_address}:${deploy_path}"
            sh "docker system prune -f"
          }
        }
      }
    }
  }
  post {
    always {
      slackSend channel: 'deployments', color: COLOR_MAP[currentBuild.currentResult], message: "*Job*: ${env.JOB_NAME} (${env.BUILD_URL}console) \n *Build Number:* ${env.BUILD_NUMBER} \n *Status: ${currentBuild.currentResult}* \n *URL : ${ip_address}*"
      cleanWs()
    }
  }
}

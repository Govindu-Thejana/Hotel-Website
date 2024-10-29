pipeline {
    agent any
    
    environment {
        DOCKER_HUB_USERNAME = 'thejana2'
        FRONTEND_IMAGE = "thejana2/web"
        BACKEND_IMAGE = "thejana2/api"
    }
    
    stages {
        stage('SCM Checkout') {
            steps {
                retry(3) {
                    git branch: 'ci-cd-pipeline', url: 'https://github.com/Govindu-Thejana/Hotel-Website.git'
                }
            }
        }
        
        stage('Build Frontend Docker Image') {
            steps {
                dir('frontend') {
                    script {
                        bat "docker build -t ${FRONTEND_IMAGE}:${BUILD_NUMBER} ."
                    }
                }
            }
        }
        
        stage('Build Backend Docker Image') {
            steps {
                dir('backend') {
                    script {
                        bat "docker build -t ${BACKEND_IMAGE}:${BUILD_NUMBER} ."
                    }
                }
            }
        }
        
        stage('Login to Docker Hub') {
            steps {
                withCredentials([string(credentialsId: 'test-pass', variable: 'test')]) {
                    script {
                        bat "docker login -u thejana2 -p %test%"
                    }
                }
            }
        }
        
        stage('Push Frontend Image to Docker Hub') {
            steps {
                script {
                    bat "docker push ${FRONTEND_IMAGE}:${BUILD_NUMBER}"
                }
            }
        }
        
        stage('Push Backend Image to Docker Hub') {
            steps {
                script {
                    bat "docker push ${BACKEND_IMAGE}:${BUILD_NUMBER}"
                }
            }
        }
    }

    post {
        always {
            bat "docker logout"
        }
    }
}

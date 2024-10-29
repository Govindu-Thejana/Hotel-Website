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
                    git branch: 'main', url: 'https://github.com/Govindu-Thejana/Hotel-Website.git'
                }
            }
        }
        
        stage('Build Frontend Docker Image') {
            steps {
                dir('frontend') {
                    script {
                        docker.build("${FRONTEND_IMAGE}:${BUILD_NUMBER}")
                    }
                }
            }
        }
        
        stage('Build Backend Docker Image') {
            steps {
                dir('backend') {
                    script {
                        docker.build("${BACKEND_IMAGE}:${BUILD_NUMBER}")
                    }
                }
            }
        }
        
         stage('Login to Docker Hub') {
            steps {
                withCredentials([string(credentialsId: 'test-dockerhubpassword', variable: 'test-dockerhubpass')]) {

                    }                  
                    script {
                        bat "docker login -u thejana2 -p %test-dockerhubpass%"
                    }
                }
            }
        }
        
        stage('Push Frontend Image to Docker Hub') {
            steps {
                script {
                    docker.image("${FRONTEND_IMAGE}:${BUILD_NUMBER}").push()
                }
            }
        }
        
        stage('Push Backend Image to Docker Hub') {
            steps {
                script {
                    docker.image("${BACKEND_IMAGE}:${BUILD_NUMBER}").push()
                }
            }
        }
    
    post {
        always {
            script {
                sh "docker logout"
            }
        }
    }

}
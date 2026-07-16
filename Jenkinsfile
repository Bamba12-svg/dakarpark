// ============================================================
//  DakarPark — Pipeline CI/CD Jenkins
//  Étapes : checkout → install → build → SonarQube → Docker → déploiement
// ============================================================

pipeline {
    agent any

    environment {
        IMAGE_NAME = 'dakarpark-frontend'
        IMAGE_TAG  = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Récupération du code source depuis Git...'
                checkout scm
            }
        }

        stage('Installation des dépendances') {
            steps {
                echo 'Installation des paquets npm...'
                sh 'npm ci'
            }
        }

        stage('Build Angular') {
            steps {
                echo 'Compilation de l\'application en production...'
                sh 'npm run build'
            }
        }

        stage('Analyse SonarQube') {
            steps {
                echo 'Analyse de la qualité du code avec SonarQube...'
                script {
                    def scannerHome = tool 'SonarScanner'
                    withSonarQubeEnv('SonarQube') {
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                echo 'Vérification du Quality Gate SonarQube...'
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: false
                }
            }
        }

        stage('Archivage des artefacts') {
            steps {
                echo 'Archivage du build...'
                archiveArtifacts artifacts: 'dist/**/*', fingerprint: true
            }
        }

        stage('Construction de l\'image Docker') {
            steps {
                echo "Construction de l'image ${IMAGE_NAME}:${IMAGE_TAG}..."
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} -t ${IMAGE_NAME}:latest ."
            }
        }

        stage('Déploiement') {
            steps {
                echo 'Déploiement du conteneur...'
                sh '''
                    docker rm -f dakarpark-frontend || true
                    docker run -d --name dakarpark-frontend -p 8080:80 dakarpark-frontend:latest
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline terminé avec succès ! Application disponible sur le port 8080.'
        }
        failure {
            echo '❌ Le pipeline a échoué. Consultez les logs ci-dessus.'
        }
    }
}

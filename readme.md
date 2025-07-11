copy code and paste on the visual studio 

make dockerfile with node:18

create docker image chat-bot:latest

chat-deployment.yaml and mongo-deployment.yaml with service on each deploymnt

eval $(minikube docker-env) to get inside the minikube-docker

kubectl apply -f chat-deplyment.yaml/mongo-deplyment.yaml

kubectl get pods

if its running its okay

minikube service chat-service

how to check the messages inside the mongodb

first 

kubectl exec -it mongo-pod-name -- mongo

if its not working then

kubectl exec -it mongo-pod-name -- sh

then inside the shell

run which mongo/ which mongosh if it shows /usr/bin/mongosh

try

kubectl exec -it mongo-pod-name -- mongosh

then to check the database messages

use chatdb
db.chatmessages.find().pretty()

it lists the messages



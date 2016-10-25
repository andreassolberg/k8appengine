# App Engine (Kubernetes)




docker build -t uninettno/k8appengine .
docker run -d -p 8080:8080 --env-file=./ENV -t uninettno/k8appengine
docker run -p 8080:8080 --env-file=./ENV -v etc:/app/etc -t uninettno/k8appengine
docker ps

docker push uninettno/k8appengine

docker build --no-cache -t uninettno/k8appengine .


To run the app engine:

```
NODE_ENV=development npm start | bunyan -l debug -L
```



# Deploy k8appengine on Kubernetes

```
kubectl --context daas create namespace appenginecore
kubectl --context daas --namespace appenginecore create -f etc-kubectl/appengine-secret.yaml
kubectl --context daas --namespace appenginecore create -f etc-kubectl/appengine-deployment.json
kubectl --context daas --namespace appenginecore create -f etc-kubectl/appengine-service.json
kubectl --context daas --namespace appenginecore create -f etc-kubectl/appengine-ingress.json

kubectl --context daas --namespace appenginecore replace -f etc-kubectl/appengine-tls-secret.yaml
kubectl --context daas --namespace appenginecore replace -f etc-kubectl/appengine-ingress.json

kubectl --context daas --namespace appenginecore get pods
```


Update secret

kubectl --context daas --namespace appenginecore replace -f etc-kubectl/appengine-secret.yaml

Inspect logs from App engine backend:

kubectl --context daas --namespace appenginecore logs -f k8appengine-2189553187-laix1 | bunyan -L


----

Text below is OUTDATED


An application spec is stored in `/etc/{app}.js`:

```
{
	"name": "Dataporten Demo",
	"id": "dataporten-demo",
	"descr": "A simple app that authenticates the user with Dataporten.",
	"template": {
		"rc": {
			...
		}
	},
	"services": {
		"sql": {},
		"dns": {},
		"dataporten": {},
		"certificate": {}
	}
}
```

Obtain a new instance of an application:

```
var dataportenApp = lib.get('dataporten-demo');
var dataportenAppInstance = dataportenApp.getInstance();
```

Some of the services that are referred to in the application spec needs user configuration before they can be provisioned. This can be things like application name of this specific instance, owner and authorization info etc.

```
dataportenAppInstance.addServiceConfiguration('dataporten', {
	'title': 'Dataporten Demo App Engine 1',
	'': ''
});
dataportenAppInstance.addServiceConfiguration('dns', {
	'hostname': 'dpdemo1.apps.labs.uninett.no',
});
```

Then services can be provisioned:

```
dataportenAppInstance.provisionServices();
```

Each service will perform provisioning, and add a provision result entry in the application instance object. The instance is now ready to be deployed.

```
var a = new AppEngine();
a.deploy(dataportenAppInstance);
```



## Get info

kubectl --context daas  --namespace appengine get deployments
kubectl --context daas  --namespace appengine get pods
kubectl --context daas  --namespace appengine get replicasets
kubectl --context daas  --namespace appengine get secrets
kubectl --context daas  --namespace appengine get configmaps
kubectl --context daas  --namespace appengine get pvc

kubectl --namespace appengine get deployments
kubectl --namespace appengine get pods
kubectl --namespace appengine get replicasets
kubectl --namespace appengine get secrets
kubectl --namespace appengine get configmaps
kubectl --namespace appengine get pvc



## Create SSL secrets

kubectl --context gke_turnkey-cocoa-720_europe-west1-c_cluster-1 --namespace appengine create -f secret-ssl.yaml



## How to clean up Dataporten provisioning.

```
dptool clients mine | grep k8e | cut -f 1 -d\  | xargs -n 1 dptool clients delete

kubectl --context daas  --namespace appengine delete deployments --all
kubectl --context daas  --namespace appengine delete services --all
kubectl --context daas  --namespace appengine delete replicaset --all
kubectl --context daas  --namespace appengine delete pods --all
kubectl --context daas  --namespace appengine delete secrets --all
kubectl --context daas  --namespace appengine delete configmaps --all
kubectl --context daas  --namespace appengine delete pvc --all
kubectl --context daas  --namespace appengine delete ingress --all

kubectl --context gke_turnkey-cocoa-720_europe-west1-c_cluster-1  --namespace appengine delete deployments --all
kubectl --context gke_turnkey-cocoa-720_europe-west1-c_cluster-1  --namespace appengine delete replicaset --all
kubectl --context gke_turnkey-cocoa-720_europe-west1-c_cluster-1  --namespace appengine delete services --all
kubectl --context gke_turnkey-cocoa-720_europe-west1-c_cluster-1  --namespace appengine delete pods --all
kubectl --context gke_turnkey-cocoa-720_europe-west1-c_cluster-1  --namespace appengine delete secrets --all
kubectl --context gke_turnkey-cocoa-720_europe-west1-c_cluster-1  --namespace appengine delete configmaps --all
kubectl --context gke_turnkey-cocoa-720_europe-west1-c_cluster-1  --namespace appengine delete pvc --all

```


## Deploying a new application

* Process an instance of an `DeploymentConfiguration`.
* Check if `DeploymentConfiguration` is already deployed, or get the status.
* Check if the `DeploymentConfiguration` differ from existing deployment.
* Update or create.

Provision all missing service provisions.

Combine application defintion, provisoned services and deployment configuraiton and get all kubernetes objects that needs to be created.

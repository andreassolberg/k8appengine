{
	"name": "Hello World",
	"id": "helloworld",
	"descr": "A simple Hello World application, running NGINX.",
	"template": {
		"rc": {
			"kind": "ReplicationController",
			"apiVersion": "v1",
			"metadata": {
				"name": "web-server-rc",
				"labels": {
					"state": "serving"
				}
			},
			"spec": {
				"replicas": 1,
				"selector": {
					"app": "web-server-v1"
				},
				"template": {
					"metadata": {
						"labels": {
							"app": "web-server-v1",
							"appid": "web-server"
						}
					},
					"spec": {
						"containers": [{
							"name": "simpleweb",
							"image": "nginx",
							"imagePullPolicy": "Always",
							"ports": [{
								"containerPort": 80
							}]
						}],
						"restartPolicy": "Always"
					}
				}
			}
		}
	},
	"services": {
		"sql": {},
		"dns": {},
		"dataporten": {},
		"certificate": {}
	}
}
{
	"name": "Dataporten Demo",
	"id": "dataporten-demo",
	"descr": "A simple app that authenticates the user with Dataporten.",
	"template": {
		"rc": {
			"kind": "ReplicationController",
			"apiVersion": "v1",
			"metadata": {
				"name": "dataporten-demo-rc",
				"labels": {
					"state": "serving"
				}
			},
			"spec": {
				"replicas": 1,
				"selector": {
					"app": "dataporten-demo-v1"
				},
				"template": {
					"metadata": {
						"labels": {
							"app": "dataporten-demo-v1",
							"appid": "dataporten-demo"
						}
					},
					"spec": {
						"containers": [{
							"name": "dataporten-demo",
							"image": "andreassolberg/dataporten-demo-app",
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
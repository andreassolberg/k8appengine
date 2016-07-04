{
	"deployment": {
		"kind": "Deployment",
		"apiVersion": "extensions/v1beta1",
		"metadata": {
		},
		"spec": {
			"replicas": 1,
			"template": {
				"metadata": {
					"labels": {
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
	},
  "service": {
    "kind": "Service",
    "apiVersion": "v1",
    "metadata": {
      "name": "hello-world-blah-blah"
    },
    "spec": {
      "selector": {
        "deployment": "hello-world-blah-blah"
      },
      "ports": [{
        "protocol": "TCP",
        "port": 80,
        "targetPort": 80
      }],
      "type": "NodePort"
    }
  }

}

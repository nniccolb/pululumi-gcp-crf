import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

const config = new pulumi.Config();
const apiKey = config.requireSecret("apiKey");

const bucket = new gcp.storage.Bucket("function-bucket", {
  location: "US",
});

const archive = new gcp.storage.BucketObject("function-zip", {
  bucket: bucket.name,
  source: new pulumi.asset.AssetArchive({
    ".": new pulumi.asset.FileArchive("./function"),
  }),
});

const fn = new gcp.cloudfunctionsv2.Function("secure-function-v2-2", {
  name: "secure-function-v2-2",
    location: "us-central1",
    description: "a new function",
    buildConfig: {
        runtime: "nodejs20",
        entryPoint: "helloHttp",
        source: {
            storageSource: {
                bucket: bucket.name,
                object: archive.name,
            },
        },
    },
    serviceConfig: {
        maxInstanceCount: 1,
        availableMemory: "256M",
        timeoutSeconds: 120,
        environmentVariables: {
          API_KEY: apiKey,
        }
    }, 
});

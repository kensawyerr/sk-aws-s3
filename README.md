# sk-aws-s3
My aws helper class to help with uploading to s3 bucket and deleting objects in s3bucket
## Installation
`npm install --save sk-aws-s3`

## Usage
``` 
const AwsS3 = require("sk-aws-s3")
const aws = new AwsS3("awsId", "awsSecret", "awsBucketName", "awsBucketUrl");
```

## Methods
### aws.upload(fileObject, allowedFormats)
``` 
fileObject: Multipart file object. e.g: form.files.image
type: Object
required: Yes

allowedFormats: List of allowed mime types. Leave blank to allow all files types. e.g: ["image/jpeg"]
type: Array
required: No

Response (Promise)
Error first {error: true / false, message:"error message"}
Successful upload: {uploaded: true, objectUrl: "url of uploaded file"}
```

### aws.delete(objectUrl)
```
//delete from s3 bucket
objectUrl: The url of the object to delete
type: String
required: Yes

Response (Promise)
Error first {error: true / false, message:"error message"}
Successful deletion: {deleted: true}
```


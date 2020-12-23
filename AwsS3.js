//AWS config
const AWS = require("aws-sdk");
const fs = require("fs");
const randomstring = require("randomstring");
const _ = require("lodash");

class AwsS3{
    constructor(awsId, awsSecret, awsBucketName, awsBucketUrl){
        this.awsBucketName = awsBucketName;
        this.awsBucketUrl = awsBucketUrl;

        this.s3 = new AWS.S3({
            accessKeyId: awsId,
            secretAccessKey: awsSecret
        });
    }

    upload(file, acceptedFormats=null){
        return new Promise((resolve, reject)=>{
            //check if there is an array of accepted file formats and then check if the format of this file is accepted
            if(acceptedFormats){
                let fileFormat = file.mimetype;
                if(!acceptedFormats.includes(fileFormat)){
                    resolve({error: true, message:"Invalid file format"});
                }
            }

            let filename = `${randomstring.generate(5)}${file.name}`;
            //first move file to temporary location
            file.mv(`${filename}`, (error)=>{

                if(error){
                    resolve({error: true, message: "File upload error"});
                }


                // Read content from the file
                const fileContent = fs.readFileSync(filename);

                // Setting up S3 upload parameters
                const params = {
                    Bucket: this.awsBucketName,
                    Key: filename, // File name you want to save as in S3
                    Body: fileContent
                };

                // Uploading files to the bucket
                this.s3.upload(params, function(error, data) {
                    if (error) {
                        resolve({error: true, message: "AWS Upload error"})
                    }

                    //delete local file after upload
                    fs.unlink(filename, ()=>{});

                    //return the link to the uploaded file on aws
                    resolve({uploaded: true, objectUrl: `${this.awsBucketUrl}${filename}`});
                });
            });
        });
    }

    delete(objectUrl){
        return new Promise((resolve, reject)=>{
            const urlParts = objectUrl.split("/");
            const file = _.last(urlParts)

            const params = {
                Bucket: this.awsBucketName,
                Key: file, // File name to delete
            };


            this.s3.deleteObject(params, (error, data)=>{
                if (error) {
                    resolve({error: true, message: "AWS Delete error"})
                }

                resolve({deleted: true});

            });
        })
    }
}

module.exports = AwsS3;
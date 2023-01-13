import { LightningElement, track } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import ACCOUNT_NAME_FIELD from '@salesforce/schema/Account.Name';
import uploadFile from '@salesforce/apex/CreateAccFileUpload.uploadFile';
export default class FileUploadWithResize extends LightningElement {
    @track fileData;
    @track image;
    @track new_image;
    accountName;

    handleCreate() {
        const inputFields = this.template.querySelectorAll('lightning-input');

        const allValid = this.checkFieldsValidity(inputFields);


        console.log('allValid---->', allValid)
        if (allValid) {
            const fields = {};
            fields[ACCOUNT_NAME_FIELD.fieldApiName] = this.accountName;

            const accountInput = { apiName: ACCOUNT_OBJECT.objectApiName, fields };

            // console.log("Outside createRecord, have file name"+this.fileName);
            createRecord(accountInput)

                .then(result => {
                    console.log('account created with id: ', result.id);
                  
                    return uploadFile({ recordId: result.id, base64: this.fileData.base64, filename: this.fileData.fileName });

                })
                .then(result => {
                    console.log('success!', result);
                })

                .catch(error => {
                    console.log('error', error);
                });
        }
    }

    checkFieldsValidity() {
        let isValid = true;
        let inputFields = this.template.querySelectorAll('.validate');
        inputFields.forEach(inputField => {
            if(!inputField.checkValidity()) {
                inputField.reportValidity();
                isValid=false;
            }
    });

        return isValid;
    }

    handleChangeAccountName(event) {
        if (event.target.name === "accountName") {
            this.accountName = event.target.value;
        }
    }

    // the onchange method for file upload
    openFileUpload(event) {
        //to capture the file data through event
        const file = event.target.files[0];
        // to read the file
        var reader = new FileReader();
        // to read the file data as a url

        reader.onload = (event) => {

            let image_url = event.target.result;
            this.image = new Image();
            this.image.src = image_url;

            this.image.onload = (evt) => {

                //determine the width of an image
                var imageWidth = this.image.width;

                //determine the height of an image
                var imageHeight = this.image.height;

                //check if the image width is greater than 200. 
                if (parseInt(imageWidth) > 200 || parseInt(imageHeight) > 200) {
                    //create the canvas element. 
                    const canvas = document.createElement('canvas');
                    // To draw on the canvas get the context like 2d 3d.
                    let ctx = canvas.getContext('2d');
                    //setting max width of the canvas image to 220
                    var MAX_WIDTH = 220;
                    //setting max height of the canvas image to 220
                    var MAX_HEIGHT = 220;
                    var width = imageWidth;
                    var height = imageHeight;

                    //check if the width is greater than height
                    if (width > height) {
                        //check if width is greater than max width
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        //check if height is greater than max height
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }
                    //assign width to the width of the canvas
                    canvas.width = width;
                    //assign height to the height of the canvas
                    canvas.height = height;

                    //drwaing the uploaded image on canvas
                    ctx.drawImage(this.image, 0, 0, width, height);
                    //converting the canvas to dataUrl
                    var dataurl = canvas.toDataURL(file.type);
                    //create a new img element
                    this.new_image = document.createElement("img");
                    this.new_image.src = dataurl;

                    const divTag = this.template.querySelector('.wrapper').appendChild(this.new_image);

                    var resizedImage = this.new_image.src;

                    console.log('Image source --->', resizedImage);

                    //store the base64 result by spliting the result and capture the 2nd part of the array
                    var base64 = resizedImage.split(',')[1];
                    //object to hold multiple fileds
                    this.fileData = {
                        'fileName': file.name,
                        'base64': base64

                    }

                }
            }

        }
        reader.readAsDataURL(file);
    }
}
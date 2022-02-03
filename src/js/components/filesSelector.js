export default function initFilesSelector() {
    if (window.File && window.FileList && window.FileReader) {
        var filesInput = document.getElementById("commentPhotos");
        if(filesInput) {
            filesInput.addEventListener("change", function(event) {
                var files = event.target.files; //FileList object
                var output = document.querySelector(".files-input__items");
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    //Only pics
                    if (!file.type.match('image'))
                        continue;
                    var picReader = new FileReader();
                    picReader.addEventListener("load", function(event) {
                        var picFile = event.target;
                        var template = `
                            <div class="files-input__item item-file">
                                <img src="${picFile.result}" alt="${picFile.name}" class="item-file__img img-responsive">
                                <button class="item-file__delete" type="button">
                                    <svg class="item-file__delete-icon">
                                        <use href="/assets/img/svg-sprite/sprite.svg#close"></use>
                                    </svg>
                                </button>
                            </div>
                        `
                        output.insertAdjacentHTML('beforeend', template);
                    });
                    //Read the image
                    picReader.readAsDataURL(file);
                }
                console.log(filesInput.files)
            });
        }
    } else {
        console.log("Your browser does not support File API");
    }
}
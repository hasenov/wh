export function removeFileFromFileList(index, inputSelector) {
    const dt = new DataTransfer()
    const input = document.querySelector(inputSelector)
    const { files } = input
    
    for (let i = 0; i < files.length; i++) {
    const file = files[i]
    if (index !== i)
        dt.items.add(file) // here you exclude the file. thus removing it.
    }
    
    input.files = dt.files // Assign the updates list
}
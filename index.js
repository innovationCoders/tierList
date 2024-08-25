// * Arrow function for not repeating code "document.querySelector('')/document.querySelectorAll('')"
const $ = el => document.querySelector(el)
const $$ = el => document.querySelectorAll(el)

// * Select input element
const imageInput = $('#image-input')
// * Selector items container
const itemsSection = $('#selector-items')
// * Select resetButton
const resetButton = $('#reset-tier-button')
// * Select saveButton
const saveButton = $('#save-tier-button')

// * Function that adds images to web page
function createItem(src) {
    // * Create a image element
    const imgElement = document.createElement('img')
    // * Add draggable attribute to image
    imgElement.draggable = true
    // * Add src attribute to image
    imgElement.src = src
    // * Add class='item-image' to image
    imgElement.className = 'item-image'
    // * Add addEventListener dragstart and callback handleDragStart
    imgElement.addEventListener('dragstart', handleDragStart)
    // * Add addEventListener dragend and callback handleDragEnd
    imgElement.addEventListener('dragend', handleDragEnd)
    // * Place image into the html inside itemsSection
    itemsSection.appendChild(imgElement)
    // * Return imgElement to reuse in other places
    return imgElement
}
// * Add addEventListener 'change' to imageInput
imageInput.addEventListener('change', (event) => {

    const { files } = event.target
    useFilesToCreateItems(files)
})
// * Function to use Browser api to create images from files
function useFilesToCreateItems(files) {

    if (files && files.length > 0) {
        // * files is a Filelist, we need to convert to array to use forEach method
        Array.from(files).forEach(file => {
            // * Create a instance to FileReader
            const reader = new FileReader()
            // * Call readAsData URL async method
            reader.readAsDataURL(file)
            // * When call readAsDataURL throw onload event and use URL to call createItem
            reader.onload = (eventReader) => {
                createItem(eventReader.target.result)
            }
        })
    }
}
// * Create two variables to value null. This variables represents draggedElement and sourceContainer
let draggedElement = null
let sourceContainer = null

// * Create a variable to select all the elements with .tier and .row classes
const rows = $$('.tier .row')

// * Add three different addEventListeners to all elements in rows
rows.forEach(row => {
    row.addEventListener('dragover', handleDragOver)
    row.addEventListener('drop', handleDrop)
    row.addEventListener('dragleave', handleDragLeave)
})

// * Add three different addEventListeners to all elements in itemsSection
itemsSection.addEventListener('dragover', handleDragOver)
itemsSection.addEventListener('drop', handleDrop)
itemsSection.addEventListener('dragleave', handleDragLeave)

// * Add addEventListeners to drag and drop from Desktop
itemsSection.addEventListener('drop', handleDropFromDesktop)
itemsSection.addEventListener('dragover', handleDragOverFromDesktop)

//* Function to handle Drag Over From Desktop
function handleDragOverFromDesktop(event) {
    // * Cancell prevent default 
    event.preventDefault()
    // * Use destructuring event for currentTarget, dataTransfer variable.
    const { currentTarget, dataTransfer } = event
    //* when Files exist in dataTransfer adding .drag-files class to use in styles css
    if (dataTransfer.types.includes('Files')) {
        currentTarget.classList.add('drag-files')
    }
}

function handleDropFromDesktop(event) {
    // * Cancell prevent default 
    event.preventDefault()
    // * Use destructuring event for currentTarget, dataTransfer variable.
    const { currentTarget, dataTransfer } = event
    if (dataTransfer.types.includes('Files')) {
        //* when Files exist in dataTransfer remove .drag-files class and place image into Selector-Items container
        currentTarget.classList.remove('drag-files')
        const { files } = dataTransfer
        useFilesToCreateItems(files)
    }
}

function handleDragStart(event) {
    // * Asign value to draggedElement to event.target
    draggedElement = event.target
    // * Asign value to sourceContainer to draggedElement.parentNode
    sourceContainer = draggedElement.parentNode
    // * 
    event.dataTransfer.setData('text/plain', draggedElement.src)
    console.log('what is this',event.target);
}
function handleDrop(event) {
    // * Cancel prevent default 
    event.preventDefault()

    const { currentTarget, dataTransfer } = event
//* When drop element exist inside sourceContainer, remove draggedElement
    if (sourceContainer && draggedElement) {
        sourceContainer.removeChild(draggedElement)
    }
    if (draggedElement) {
        // * Place imgElement to currenTarget with data inside in dataTransfer
        const src = dataTransfer.getData('text/plain')
        const imgElement = createItem(src)
        currentTarget.appendChild(imgElement)
    }
    //* remove drag-over and drag-preview class
    currentTarget.classList.remove('drag-over')
    currentTarget.querySelector('.drag-preview')?.remove()
}

function handleDragOver(event) {
    event.preventDefault()

    const { currentTarget, dataTransfer } = event
    if (sourceContainer === currentTarget) return

    currentTarget.classList.add('drag-over')

    const dragPreview = document.querySelector('.drag-preview')

    if (draggedElement && !dragPreview) {
        const previewElement = draggedElement.cloneNode(true)
        previewElement.classList.add('drag-preview')
        currentTarget.appendChild(previewElement)
    }
}

function handleDragLeave(event) {
    event.preventDefault()

    const { currentTarget } = event
    currentTarget.classList.remove('drag-over')
    currentTarget.querySelector('.drag-preview')?.remove()
}


function handleDragEnd() {
    draggedElement = null
    sourceContainer = null
}

resetButton.addEventListener('click', () => {
    const items = $$('.tier .item-image')
    items.forEach(item => {
        item.remove()
        itemsSection.appendChild(item)
    })
})

saveButton.addEventListener('click', () => {
    const tierContainer = $('.tier')
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    import('https://cdn.jsdelivr.net/npm/html2canvas-pro@1.5.8/+esm')
        .then(({ default: html2canvas }) => {
            html2canvas(tierContainer).then(canvas => {
                ctx.drawImage(canvas, 0, 0)
                const imgURL = canvas.toDataURL('image/png')

                const downloadLink = document.createElement('a')
                downloadLink.download = 'tier.png'
                downloadLink.href = imgURL
                downloadLink.click()
            })
        })
})
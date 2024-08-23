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

let draggedElement = null
let sourceContainer = null

const rows = $$('.tier .row')

rows.forEach(row => {
    row.addEventListener('dragover', handleDragOver)
    row.addEventListener('drop', handleDrop)
    row.addEventListener('dragleave', handleDragLeave)
})

itemsSection.addEventListener('dragover', handleDragOver)
itemsSection.addEventListener('drop', handleDrop)
itemsSection.addEventListener('dragleave', handleDragLeave)

itemsSection.addEventListener('drop', handleDropFromDesktop)
itemsSection.addEventListener('dragover', handleDragOverFromDesktop)

function handleDragOverFromDesktop(event) {
    event.preventDefault()

    const { currentTarget, dataTransfer } = event

    if (dataTransfer.types.includes('Files')) {
        currentTarget.classList.add('drag-files')
    }
}

function handleDropFromDesktop(event) {
    event.preventDefault()
    const { currentTarget, dataTransfer } = event

    if (dataTransfer.types.includes('Files')) {
        currentTarget.classList.remove('drag-files')
        const { files } = dataTransfer
        useFilesToCreateItems(files)
    }
}

function handleDrop(event) {
    event.preventDefault()

    const { currentTarget, dataTransfer } = event

    if (sourceContainer && draggedElement) {
        sourceContainer.removeChild(draggedElement)
    }

    if (draggedElement) {
        const src = dataTransfer.getData('text/plain')
        const imgElement = createItem(src)
        currentTarget.appendChild(imgElement)
    }

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

function handleDragStart(event) {
    draggedElement = event.target
    sourceContainer = draggedElement.parentNode
    event.dataTransfer.setData('text/plain', draggedElement.src)
}

function handleDragEnd(event) {
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
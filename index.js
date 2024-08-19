const $ = el => document.querySelector(el);
const $$ = el => document.querySelectorAll(el);

const imageInput = $('#image-input');
const itemsSection = $('#selector-items');

imageInput.addEventListener('change', (event) => {
    const [file] = event.target.files;
    console.log('Archivo seleccionado:', file);

    if (file) {
        const reader = new FileReader();
        console.log('FileReader creado');

        reader.onload = (eventReader) => {
            console.log('FileReader onload ejecutado');
            console.log('Resultado del FileReader:', eventReader.target.result);

            const imgElement = document.createElement('img');
            imgElement.src = eventReader.target.result;
            imgElement.className = 'item-image';
            itemsSection.appendChild(imgElement);
            console.log('Imagen añadida al DOM');
        };

        reader.readAsDataURL(file);
        console.log('readAsDataURL llamado');
    } else {
        console.error('No se seleccionó ningún archivo o el archivo no es válido.');
    }
});
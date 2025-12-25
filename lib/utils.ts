import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export async function uploadFile(fileObject: File | Blob) {

    // 1. Definimos la ruta completa que tendrá en R2
    //    ¡MUY IMPORTANTE: debe incluir el prefijo!
    const filename = fileObject instanceof File ? fileObject.name : 'unnamed';
    const r2Key = `Gubernamental/${filename}`;

    // 2. Esta es la URL de tu worker
    const workerApiUrl = 'https://capictive-rest.diogofabricio17.workers.dev/api/files/upload';

    try {
        const response = await fetch(workerApiUrl, {
            method: 'POST',
            body: fileObject,
            headers: {
                'X-File-Name': r2Key,

                'Content-Type': fileObject.type
            }
        });

        if (!response.ok) {
            throw new Error(`Error del servidor: ${response.status} ${await response.text()}`);
        }

        const result = await response.json();
        console.log('¡Éxito!', result);
        return result;

    } catch (error) {
        console.error('Falló la subida:', error);
    }
}

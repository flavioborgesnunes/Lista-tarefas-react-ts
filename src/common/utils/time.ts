export function tempoParaSegundos(tempo: string){
    const [horas = '0', minutos = '0', segundos = '0'] = tempo.split(':');
    const horasEmSegundos = Number(horas) * 3600;
    const minutosEmsegundos = Number(minutos) * 60;
    return horasEmSegundos + minutosEmsegundos + Number(segundos);
    
}
const BASE_DE_DATOS = Array.from({ length: 60 }, (_, i) => ({
  id: i + 1,
  marca: ["Toyota", "Nissan", "BMW", "Kia"][i % 4],
  modelo: ["Corolla", "Sentra", "X5", "Sportage"][i % 4],
  precioDia: Math.floor(Math.random() * 150000) + 50000, // Precio entre 50k y 200k
  tipo: ["Sedán", "SUV", "Deportivo", "Hatchback"][i % 4],
  año: 2020 + (i % 5),
  transmision: ["Automático", "Manual"][i % 2],
  descripcion: `Vehículo en excelente estado, ${["aire acondicionado", "tecnología Bluetooth", "asientos de cuero", "GPS integrado", "sensores de parqueo", "cámara trasera"][i % 6]}.`,
  imagen: ["/img/corolla.jpg","/img/nissan.jpg","/img/bmw.jpg","/img/kia.jpeg","/img/ford.jpg","/img/camaro.jpg"][i % 6],
}));

export function obtenerProductos(pagina, tamañoPagina = 15) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const inicio = (pagina - 1) * tamañoPagina;
      resolve(BASE_DE_DATOS.slice(inicio, inicio + tamañoPagina));
    }, 800);
  });
}
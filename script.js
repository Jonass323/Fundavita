let participantes = [];

document.getElementById('archivo').addEventListener('change', function (event) {
  const archivo = event.target.files[0];
  if (!archivo) return;
  const ext = archivo.name.split('.').pop().toLowerCase();
  if (['txt', 'csv'].includes(ext)) leerTexto(archivo);
  else if (['xlsx', 'xls'].includes(ext)) leerExcel(archivo);
  else alert('Formato no soportado. Usa .txt, .csv o .xlsx');
});

function leerTexto(archivo) {
  const lector = new FileReader();
  lector.onload = e => {
    const contenido = e.target.result;
    participantes = contenido.split(/\r?\n|,|;/)
      .map(p => p.trim())
      .filter(p => p);
    actualizarVista();
  };
  lector.readAsText(archivo);
}

function leerExcel(archivo) {
  const lector = new FileReader();
  lector.onload = e => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const hoja = workbook.Sheets[workbook.SheetNames[0]];
    const filas = XLSX.utils.sheet_to_json(hoja, { header: 1 });
    participantes = filas
      .map(fila => fila.filter(c => c).join(' '))
      .filter(nombre => nombre.length > 1);
    actualizarVista();
  };
  lector.readAsArrayBuffer(archivo);
}

function cargarManual() {
  const texto = document.getElementById('lista').value;
  const nuevos = texto.split(/\r?\n|,/).map(p => p.trim()).filter(p => p);
  participantes = participantes.concat(nuevos);
  actualizarVista();
  document.getElementById('lista').value = '';
}

function actualizarVista() {
  document.getElementById('cantidad').innerText = `Participantes cargados: ${participantes.length}`;
  const contenedor = document.getElementById('lista-participantes');
  contenedor.innerHTML = participantes.map(p => `<div>${p}</div>`).join('');
}

function sortearGanador() {
  if (participantes.length === 0) {
    alert('Primero cargá o escribí la lista de participantes.');
    return;
  }

  const ganador = participantes[Math.floor(Math.random() * participantes.length)];
  document.getElementById('nombre-ganador').textContent = ganador;

  // Mostrar pantalla del ganador
  document.getElementById('pantalla-principal').style.display = 'none';
  const pantallaGanador = document.getElementById('pantalla-ganador');
  pantallaGanador.classList.remove('oculto');

  lanzarConfeti();
}

function volverInicio() {
  document.getElementById('pantalla-ganador').classList.add('oculto');
  document.getElementById('pantalla-principal').style.display = 'block';
}

/* 🎊 Animación de confeti */
function lanzarConfeti() {
  const canvas = document.getElementById('confeti');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const confetis = [];

  for (let i = 0; i < 150; i++) {
    confetis.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 3,
      d: Math.random() * 150,
      color: `hsl(${Math.random() * 360}, 100%, 60%)`,
      tilt: Math.random() * 10 - 10
    });
  }

  function dibujarConfeti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confetis.forEach(c => {
      ctx.beginPath();
      ctx.fillStyle = c.color;
      ctx.moveTo(c.x + c.tilt + c.r, c.y);
      ctx.lineTo(c.x + c.tilt, c.y + c.r);
      ctx.lineTo(c.x + c.tilt - c.r, c.y);
      ctx.closePath();
      ctx.fill();
    });
    actualizarConfeti();
  }

  function actualizarConfeti() {
    confetis.forEach(c => {
      c.y += 2 + Math.random() * 3;
      c.x += Math.sin(c.d) / 2;
      c.tilt += Math.random() * 0.5 - 0.25;
      if (c.y > canvas.height) c.y = -10;
    });
  }

  function animar() {
    dibujarConfeti();
    requestAnimationFrame(animar);
  }

  animar();
}

/* 🕒 Contador regresivo simple */
function iniciarCuentaRegresiva() {
  const segundosInput = document.getElementById("tiempo");
  let segundos = parseInt(segundosInput.value) || 10;

  const cuenta = document.getElementById("cuenta-regresiva");
  cuenta.classList.remove("oculto");
  cuenta.textContent = segundos;

  const intervalo = setInterval(() => {
    segundos--;
    cuenta.textContent = segundos;

    if (segundos <= 0) {
      clearInterval(intervalo);
      cuenta.classList.add("oculto");
      sortearGanador();
    }
  }, 1000);
}




// 🔢 ROMANOS
function romano(n){
 const r=["","I","II","III","IV","V","VI","VII","VIII","IX","X"];
 return r[n] || n;
}

// 📚 NOMBRES
const nombres={
 H:"hidrógeno", O:"oxígeno", Fe:"hierro", Na:"sodio",
 Cl:"cloro", S:"azufre", C:"carbono", N:"nitrógeno",
 Ca:"calcio", K:"potasio", Br:"bromo", I:"yodo"
};

// 🔤 PREFIJOS
const pref=["","mono","di","tri","tetra","penta","hexa"];

// 🔥 RAÍCES CORRECTAS CON TILDE
const raices = {
 cloro: "clórico",
 bromo: "brómico",
 yodo: "yódico",
 azufre: "sulfúrico",
 nitrógeno: "nítrico"
};

// 🧠 PARSER (CON PARÉNTESIS)
function parsearFormula(f){
 let stack=[{}],i=0;

 while(i<f.length){
  if(f[i]=="("){stack.push({});i++;continue;}

  if(f[i]==")"){
   i++;
   let num="";
   while(/\d/.test(f[i])) num+=f[i++];
   let mult=num?parseInt(num):1;

   let top=stack.pop();
   let last=stack.at(-1);

   for(let el in top){
    last[el]=(last[el]||0)+top[el]*mult;
   }
   continue;
  }

  let m=f.slice(i).match(/^([A-Z][a-z]?)(\d*)/);
  if(m){
   let el=m[1];
   let cant=m[2]?parseInt(m[2]):1;

   let top=stack.at(-1);
   top[el]=(top[el]||0)+cant;

   i+=m[0].length;
  } else i++;
 }

 return stack[0];
}

// 🔍 DETECTAR TIPO
function tipo(c){
 let e = Object.keys(c);
 let central = e.find(x=>x!=="H" && x!=="O");

 if (c.O && c.H && e.length === 3 && !["Cl","S","N","Br","I"].includes(central)) {
   return "Hidróxido";
 }

 if (e.includes("H") && e.includes("O") && e.length === 3) {
   return "Oxoácido";
 }

 if (e.includes("H") && e.length === 2) return "Ácido binario";

 if (c.O && e.length === 2) return "Óxido";

 if (c.H && e.length === 2) return "Hidruro";

 return "Sal";
}

// ⚡ CALCULAR OXIDACIÓN
function calcularOxidacion(c, central){
 let H = c.H || 0;
 let O = c.O || 0;
 return (O * 2 - H) / c[central];
}

// 🧾 GENERAR NOMBRES
function nombresComp(c){
 let t = tipo(c);
 let e = Object.keys(c);

 // 🔥 OXOÁCIDOS
 if(t === "Oxoácido"){
  let central = e.find(x => x !== "H" && x !== "O");
  let ox = calcularOxidacion(c, central);

  const oxoacidos = {
    Cl:{1:"Ácido hipocloroso",3:"Ácido cloroso",5:"Ácido clórico",7:"Ácido perclórico"},
    Br:{1:"Ácido hipobromoso",3:"Ácido bromoso",5:"Ácido brómico",7:"Ácido perbrómico"},
    I:{1:"Ácido hipoyodoso",3:"Ácido yodoso",5:"Ácido yódico",7:"Ácido peryódico"},
    S:{4:"Ácido sulfuroso",6:"Ácido sulfúrico"},
    N:{5:"Ácido nítrico"}
  };

  let nom = nombres[central] || central;
  let trad = oxoacidos[central]?.[ox] || `Ácido ${nom}`;

  let prefijo = pref[c.O];
  if(prefijo === "mono") prefijo = "";

  let base = raices[nom] || nom;

  return {
    tipo: "Ácido",
    tradicional: trad,
    stock: `Ácido de ${nom} (${romano(ox)})`,
    sistematica: `Ácido ${prefijo ? prefijo : ""}oxo${base} (${romano(ox)})`
  };
 }

 // 🧪 HIDRÓXIDOS
 if(t === "Hidróxido"){
  let metal = e.find(x=>x!=="O" && x!=="H");
  let nom = nombres[metal] || metal;

  return {
   tipo:t,
   tradicional:`Hidróxido de ${nom}`,
   stock:`Hidróxido de ${nom}`,
   sistematica:`Hidróxido de ${nom}`
  };
 }

 // 🧪 ÁCIDOS BINARIOS
 if(t==="Ácido binario"){
  let el=e.find(x=>x!=="H");
  let nom=nombres[el]||el;

  return {
   tipo:t,
   tradicional:`Ácido ${nom}hídrico`,
   stock:`Ácido ${nom}hídrico`,
   sistematica:`Hidruro de ${nom}`
  };
 }

 // 🧪 ÓXIDOS
 if(t==="Óxido"){
  let el=e.find(x=>x!=="O");
  let nom=nombres[el]||el;
  let val=(c.O*2)/c[el];

  return {
   tipo:t,
   tradicional:`Óxido de ${nom}`,
   stock:`Óxido de ${nom} (${romano(val)})`,
   sistematica:`${pref[c.O]}óxido de ${nom}`
  };
 }

 // 🧪 HIDRUROS
 if(t==="Hidruro"){
  let el=e.find(x=>x!=="H");
  let nom=nombres[el]||el;

  return {
   tipo:t,
   tradicional:`Hidruro de ${nom}`,
   stock:`Hidruro de ${nom}`,
   sistematica:`Hidruro de ${nom}`
  };
 }

 // 🧂 SALES
 let [m,nm]=e;

 let suf={
   Cl:"cloruro",Br:"bromuro",I:"yoduro",
   S:"sulfuro",N:"nitruro",C:"carburo"
 };

 let nomMetal = nombres[m] || m;
 let nomNoMetal = suf[nm] || nm;

 let nombreSal = `${nomNoMetal} de ${nomMetal}`;
 nombreSal = nombreSal.charAt(0).toUpperCase() + nombreSal.slice(1);

 return {
  tipo:"Sal",
  tradicional:nombreSal,
  stock:nombreSal,
  sistematica:nombreSal
 };
}

// 🔥 FUNCIÓN PRINCIPAL
function convertir(){
 let f=document.getElementById("formula").value.trim();

 if(!f){
  document.getElementById("resultado").innerHTML="Escribe una fórmula";
  return;
 }

 let c=parsearFormula(f);
 let n=nombresComp(c);

 document.getElementById("resultado").innerHTML=`
 <p><b>Tipo:</b> ${n.tipo}</p>
 <p><b>Tradicional:</b> ${n.tradicional}</p>
 <p><b>Stock:</b> ${n.stock}</p>
 <p><b>Sistemática:</b> ${n.sistematica}</p>
 `;

 let li=document.createElement("li");
 li.textContent=f+" → "+n.tradicional;
 document.getElementById("historial").prepend(li);
}

// 🔥 TABS (CORREGIDO)
function cambiarTab(tabId){
 document.querySelectorAll(".tab").forEach(tab=>{
  tab.classList.remove("active");
 });

 document.querySelectorAll(".tab-content").forEach(content=>{
  content.classList.remove("active");
 });

 document.getElementById(tabId).classList.add("active");

 const botones = document.querySelectorAll(".tab");

 if(tabId === "resultadoTab"){
  botones[0].classList.add("active");
 } else {
  botones[1].classList.add("active");
 }
}
var nupuValue;
function foo(nupp){
	nupuValue = nupp.value;
	console.log(nupuValue);
	localStorage.setItem("nupuvalue", nupuValue);
}


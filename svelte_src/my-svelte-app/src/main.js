import App from './App.svelte';

let targets = document.getElementsByClassName("rohberg-expertsearch-svelte-app");

for(let i = 0;i < targets.length; i++){
    let target = targets[i];
    const app_instance = new App({
    target: target,
    props: {
    }
  });
}

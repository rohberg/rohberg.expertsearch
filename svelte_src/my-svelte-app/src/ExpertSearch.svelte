<script>
  import { onMount } from "svelte";
  import { scale } from "svelte/transition";
  import { flip } from "svelte/animate";

  let searchstring = '';
  let region = 'Alle Regionen';
  // TODO menuregions according values in backend index
  let menuregions = [
    'Alle Regionen',
    'Zürich Stadt',
    'Zürich Oberland',
    'Zürich Unterland',
    'Albis',
    'Winterthur',
  ]
  
  let apiURL = process.env.isProd ? '/' : 'http://localhost:8080/Plone/';
  apiURL = apiURL + '@search?portal_type=dexterity.membrane.member&fullobjects=1&sort_on=last_name&sort_order=ascending';

  let searchUrl = ''
  let experts = [];

  function setSearchUrl(region='Alle Regionen', searchstring='') {
    searchUrl = ((region == 'Alle Regionen') ? apiURL : apiURL + '&region=' + encodeURI(region))
      + (searchstring ? ('&SearchableText=' + searchstring) : '');
  };

  async function getExperts(url=apiURL) {
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      experts = data?.items || [];
      return experts;
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
  };

  onMount(() => {
    getExperts()
  })

  const handleClickRegion = (event) => {
    region = event.target.value;
    setSearchUrl(region, searchstring);
    getExperts(searchUrl);
  }
  const handleSearchstring = (event) => {
    searchstring = event.target.value + (event.target.value ? '*':'');
    setSearchUrl(region, searchstring);
    getExperts(searchUrl);
  }
</script>


<h2>Expert Search</h2>
<form action="">
  <input class="searchstring" placeholder="Suche"
    on:keyup={handleSearchstring}
    >
  <br>
  {#each menuregions as menuregion}
    <input 
      type=button
      class="regionbutton"
      class:selected="{region === menuregion}"
      on:click|preventDefault={handleClickRegion}
      value={menuregion}>
  {/each}
</form>
<p class="debug"><i>Search{#if searchstring}{' '}for {searchstring}{/if} in {region}</i></p>

<div class="debug">
  searchstring: {searchstring}<br>
  region: {region}<br>
  <!-- experts: <br>{JSON.stringify(experts)}<br> -->
</div>

<div class="cards">
  {#each experts as expert, i (expert['@id'])}
    <div class="card" transition:scale animate:flip={{ duration: 300 }}>
      <div class="portrait">
        <img src="{expert.image?.download || ''}" alt="Portrait" />
      </div>
      <div class="fullname">{expert.first_name} {expert.last_name}</div>
      <div class="competence">{expert.competence}</div>
      <div class="organisation">{expert.organisation}</div>
      <div class="region">{expert.region}</div>
    </div>
  {:else}
    <p>Keine Experten gefunden</p>
  {/each}
</div>


<style>
  h2 {
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }
  .searchstring,
  .searchstring:focus {
    border: none;
    border-bottom:  2px solid darkgrey;
    border-radius: 0;
    margin-bottom: 1em;
  }
  .searchstring:focus {
    border: none;
    border-bottom:  2px solid #007cbf;
    outline: none;
  }
  .regionbutton {
    font-size: 80%;
    margin: 0 .5em .6em 0;
    background-color: white;
    border: 2px solid #007cbf;
    border-radius: 8px;
  }
  .regionbutton.selected {
    border-color: #00507a;
    color: #00507a;
  }
  .cards {
    display: flex;
    flex-wrap: wrap;
    margin-top: 2rem;
  }
  .card {
    width: 20rem;
    min-width: 10rem;
    height: 12rem;
    background: white;
    margin: 0 1rem 1rem 0;
    padding: 1.5rem 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    border-radius: 3px;
  }
  .fullname {
    margin-bottom: 1em;
  }
  .competence,
  .organisation,
  .region {
    font-size: 90%;
    margin-bottom: .1em;
  }
  .portrait {
    float: right;
    height: 100px;
    width: 100px;
    overflow: hidden;
  }
  .portrait img {
    width: 100%;
  }

  .debug {
    display: none;
    font-family: 'Courier New', Courier, monospace;
  }
</style>

<script>
  import { onMount } from "svelte";
  import { scale } from "svelte/transition";
  import { flip } from "svelte/animate";
  import { SyncLoader } from 'svelte-loading-spinners'

  // TODO menuregions according values in backend index
  const menuregions = [
    'Alle Regionen',
    'Zürich Stadt',
    'Zürich Oberland',
    'Zürich Unterland',
    'Albis',
    'Winterthur',
  ]

  const apiUrl = __myapp.env.API_URL + '@search?portal_type=' + __myapp.env.PORTAL_TYPE + '&fullobjects=1&sort_on=last_name&sort_order=ascending&b_size=60';

  // state
  let searchstring = '';
  let region = 'Alle Regionen';
  let searchUrl = apiUrl;

  let experts = [];
  let isLoading = false;

  function setSearchUrl(region='Alle Regionen', searchstring='') {
    searchUrl = ((region == 'Alle Regionen') ? apiUrl : apiUrl + '&region=' + encodeURI(region))
      + (searchstring ? ('&SearchableText=' + searchstring) : '');
  };

  async function getExperts(url=searchUrl) {
    isLoading = true;
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
      experts = experts.length > 0 ? experts.filter(exp => exp.is_expert) : [];
      console.log('** Experts');
      console.log(searchUrl);
      console.log('experts', experts);
      return experts;
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    })
    .finally(() => isLoading=false);
  };

  onMount(() => {
    getExperts()
  })

  const handleClickRegion = (event) => {
    region = event.target.value;
    setSearchUrl(region, searchstring);
    console.log("searchUrl", searchUrl);
    getExperts(searchUrl);
  }
  const handleSearchstring = (event) => {
    searchstring = event.target.value + (event.target.value ? '*':'');
    setSearchUrl(region, searchstring);
    getExperts(searchUrl);
  }
</script>


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

<div class="expertsearch cards">
  {#each experts as expert, i (expert['@id'])}
    <div class="card" transition:scale animate:flip={{ duration: 300 }}>  
      <div class="cardinner">
        <div class="cardbgbox"></div>
        {#if expert.image}
          <a class="cardimagebox" href={expert['@id']}>
            <div class="portrait">
              <img src="{expert.image?.scales.small.download || ''}" alt="Portrait" />
            </div>
          </a>
        {/if}        
        <div class="cardtextbox">
          <a href={expert['@id']}>
            <div class="fullname">{expert.first_name} {expert.last_name}</div>
          </a>
          {#if expert.telnr}
            <div class="telephone">{expert.telnr}</div>
          {/if}
          {#if expert.email}
            <div class="email"><a href="mailto:{expert.email}">{expert.email}</a></div>
          {/if}
          {#if expert.website}
            <div class="website">
              <a href="{expert.website}">Website</a>
            </div>
          {/if}
        </div>
        <div class="cardlabel">
          {#if expert.organisation}
            <div class="organisation">{expert.organisation}</div>
          {/if}
          {#if expert.region}
            <div class="region">{expert.region}</div>
          {/if}
          {#if expert.competence}
            <div class="competence">{expert.competence}</div>
          {/if}
        </div>




      </div>
    </div>
  {:else}
    {#if !isLoading}
      <p>Keine Experten gefunden</p>
    {/if}
  {/each}
  {#if isLoading}
    <div class="spinner">
      <SyncLoader size="30" color="#007cbf" unit="px" duration="2s"></SyncLoader>
    </div>
  {/if}
</div>


<style>
  .spinner {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  /* h3 {
    text-transform: uppercase;
    font-size: 3em;
    font-weight: 100;
  } */
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
    outline: none;
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
    /* width: 20rem;
    min-width: 10rem;    
    height: 10rem; */
    width: 45%;
    min-height: 10em;
    background: white;
    margin: 0 1rem 1rem 0;
    padding: 1.5rem 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    border-radius: 3px;
  }
  .fullname {
    margin-bottom: 1em;
  }
  .telephone,
  .email,
  .competence,
  .organisation,
  .region {
    /* font-size: 90%; */
    margin-bottom: .1em;
  }
  .email {
    margin-bottom: .6em;
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

<script>
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

  const apiUrl = __myapp.env.API_URL;
  const searchApiUrl = apiUrl + '@search?portal_type=' + __myapp.env.PORTAL_TYPE + '&fullobjects=1&sort_on=last_name&sort_order=ascending&b_size=200';

  // state of component
  let searchstring = '';
  let region = 'Alle Regionen';
  $: searchUrl = ((region == 'Alle Regionen') ? searchApiUrl : searchApiUrl + '&region=' + encodeURI(region))
      + (searchstring ? ('&SearchableText=' + searchstring + '*') : '');
  let experts = [];
  let isLoading = false;

  let searchstringRef;

  // $: console.log('searchstring', searchstring);
  // $: console.log('region:', region);
  // $: console.log('searchUrl:', searchUrl);
  // $: console.log('experts:', experts);

  $: getExperts(searchstring, region);


  async function getExperts(mysearchstring, myregion) {
    isLoading = true;

    // trigger search from 3 letters on
    // search also if empty searchstring
    if (mysearchstring.length < 3 && mysearchstring.length > 0) {
      return
    }

    fetch(searchUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      mode: 'cors',
      // cache: 'default',
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      let items = data?.items || [];
      experts = items.length > 0 ? items.filter(exp => exp.is_expert) : [];
      return experts;
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    })
    .finally(() => isLoading=false);
  };

  const handleClickRegion = (event) => {
    region = event.target.value;
  }

  const handleReset = (event) => {
    searchstring = '';
    searchstringRef.focus();
  }

  const textTruncate = (string, length) => {
    let trimmedString = string.length > length ? 
                        string.substring(0, length - 3) + "..." : 
                        string;
    return trimmedString;
  }
</script>


<form on:submit|preventDefault >
  <input class="searchstring" placeholder="Suche"
    bind:this={searchstringRef}
    bind:value={searchstring}
    >
  <a class={searchstring.length > 0 ? 'resetbutton' : 'hidden'} 
    on:click|preventDefault={handleReset} href=".">&#10005;</a>
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

<div class="debug">
  Anzahl: {experts?.length || 0}<br>
  searchstring: {searchstring}<br>
  region: {region}<br>
  <!-- experts: <br>{JSON.stringify(experts)}<br> -->
</div>

<div class="cards">
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
          {#if expert.alternativeEmail}
            <div class="email"><a href="mailto:{expert.alternativeEmail}">{expert.alternativeEmail}</a></div>
          {:else if expert.email}
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
            <div class="competence">{textTruncate(expert.competence, 90)}</div>            
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
  .hidden {
    display: none;
  }
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
    margin-bottom: .4em;
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

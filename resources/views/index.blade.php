<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <meta name="theme-color" content="#fff4e6">
  <title>Will you go on a date with me?</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bagel+Fat+One&family=Figtree:wght@500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="{{ asset('style.css') }}?v={{ time() }}">
</head>
<body data-to="{{ $to }}" data-from="{{ $from }}" data-plan-url="{{ route('plan.store') }}" data-gif="{{ asset('gif') }}">
  <main class="sheet">

    <section data-step="landing">
      <figure class="pic"><img id="hero-gif" src="{{ asset('gif/cuddle-cute.gif') }}" alt="Two cartoon bears hugging" width="200" height="200"></figure>
      <p class="bubble" id="no-message" aria-live="polite" hidden></p>
      <h1 class="title" tabindex="-1">{{ $to ? $to.', will' : 'Will' }} you go on a date with me?</h1>
      <p class="sub">I made this page so you can plan all of it. It starts with a yes.</p>
      <div class="actions" id="actions">
        <button id="btn-yes" class="btn yes" type="button">Yes, I'd love to</button>
        <span id="no-slot"><button id="btn-no" class="btn no" type="button">No</button></span>
      </div>
      <p class="hint">The No button is shy. Try it.</p>
    </section>

    <section data-step="date" hidden>
      <ol class="progress" aria-label="Step 1 of 4"><li class="on"></li><li></li><li></li><li></li></ol>
      <h2 class="title" tabindex="-1">What kind of date?</h2>
      <p class="sub">Kiss the one you're in the mood for.</p>
      <div class="opts" id="date-options"></div>
      <div class="actions"><button class="btn ghost" type="button" data-go="landing">Back</button><button class="btn yes" type="button" data-go="day" data-need="date">Continue</button></div>
    </section>

    <section data-step="day" hidden>
      <ol class="progress" aria-label="Step 2 of 4"><li class="on"></li><li class="on"></li><li></li><li></li></ol>
      <figure class="pic small"><img src="{{ asset('gif/dudu-flow-kiss-cute-dudu.gif') }}" alt="A cartoon bear blowing a kiss" width="120" height="120"></figure>
      <h2 class="title" tabindex="-1">Which day?</h2>
      <p class="sub">Pick a day and I'll clear my schedule.</p>
      <input type="date" id="day-input" class="field" aria-label="Date">
      <div class="actions"><button class="btn ghost" type="button" data-go="date">Back</button><button class="btn yes" type="button" data-go="time" data-need="day">Continue</button></div>
    </section>

    <section data-step="time" hidden>
      <ol class="progress" aria-label="Step 3 of 4"><li class="on"></li><li class="on"></li><li class="on"></li><li></li></ol>
      <figure class="pic small"><img src="{{ asset('gif/dudu-flow-kiss-cute-dudu.gif') }}" alt="A cartoon bear blowing a kiss" width="120" height="120"></figure>
      <h2 class="title" tabindex="-1">What time should I pick you up?</h2>
      <p class="sub">Pick a quick option, or set the hour, minutes and AM or PM.</p>
      <div class="chips" id="time-chips"></div>
      <div class="timebox" role="group" aria-label="Time">
        <select id="hh" class="field sel" aria-label="Hour"></select><span class="colon">:</span><select id="mm" class="field sel" aria-label="Minutes"></select>
        <div class="ampm" id="ampm"><button type="button" class="chip" data-value="AM" aria-pressed="false">AM</button><button type="button" class="chip" data-value="PM" aria-pressed="false">PM</button></div>
      </div>
      <div class="actions"><button class="btn ghost" type="button" data-go="day">Back</button><button class="btn yes" type="button" data-go="food" data-need="time">Continue</button></div>
    </section>

    <section data-step="food" hidden>
      <ol class="progress" aria-label="Step 4 of 4"><li class="on"></li><li class="on"></li><li class="on"></li><li class="on"></li></ol>
      <h2 class="title" tabindex="-1">What are we eating?</h2>
      <p class="sub">Your taste buds decide.</p>
      <div class="opts" id="food-options"></div>
      <div class="actions"><button class="btn ghost" type="button" data-go="time">Back</button><button class="btn yes" type="button" data-go="result" data-need="food">Confirm the plan</button></div>
    </section>

    <section data-step="result" hidden>
      <h2 class="title" tabindex="-1">It's a date!</h2>
      @include('partials.ticket')
      <div class="actions wrap">
        <button class="btn yes" type="button" id="save-plan">Save our plan</button>
        <button class="btn no" type="button" id="add-cal">Add to calendar</button>
        <button class="btn ghost" type="button" id="restart">Start over</button>
      </div>
      <p class="status" id="status" aria-live="polite"></p>
    </section>

  </main>
  <div class="party" id="party" aria-hidden="true">
    <div class="g" style="--w:150px">
      <div class="tenor-gif-embed" data-postid="13155641" data-share-method="host" data-aspect-ratio="1.04762" data-width="100%"><a href="https://tenor.com/view/mo%C3%A8-mo%C3%A8fear-happy-blush-cat-sticker-gif-13155641">Moè Moèfear Sticker</a></div>
    </div>
    <div class="g" style="--w:160px">
      <div class="tenor-gif-embed" data-postid="4773309837646014635" data-share-method="host" data-aspect-ratio="1" data-width="100%"><a href="https://tenor.com/view/bubu-happy-celebration-celebrate-gif-4773309837646014635">Bubu Happy Sticker</a></div>
    </div>
    <div class="g" style="--w:105px">
      <div class="tenor-gif-embed" data-postid="12431915919690101846" data-share-method="host" data-aspect-ratio="0.561224" data-width="100%"><a href="https://tenor.com/view/reggie-couz-happy-dancing-excited-hurray-gif-12431915919690101846">Reggie Couz Happy Sticker</a></div>
    </div>
    <div class="g" style="--w:170px">
      <div class="tenor-gif-embed" data-postid="6628766634851716507" data-share-method="host" data-aspect-ratio="1.20667" data-width="100%"><a href="https://tenor.com/view/cc-gif-6628766634851716507">Cc Sticker</a></div>
    </div>
    <div class="g" style="--w:160px">
      <div class="tenor-gif-embed" data-postid="14167684" data-share-method="host" data-aspect-ratio="1.38605" data-width="100%"><a href="https://tenor.com/view/jonah-hill-yay-screaming-shouting-getting-ready-gif-14167684">Jonah Hill Yay GIF</a></div>
    </div>
    <div class="g" style="--w:110px">
      <div class="tenor-gif-embed" data-postid="24871379" data-share-method="host" data-aspect-ratio="0.665625" data-width="100%"><a href="https://tenor.com/view/deodorisant-air-freshener-deodorizer-deodorant-deo-gif-24871379">Deodorisant Air Freshener GIF</a></div>
    </div>
    <div class="g" style="--w:105px">
      <div class="tenor-gif-embed" data-postid="1161950183627866735" data-share-method="host" data-aspect-ratio="0.561224" data-width="100%"><a href="https://tenor.com/view/dancing-cat-cat-funny-happy-excited-gif-1161950183627866735">Dancing Cat Funny Sticker</a></div>
    </div>
    <div class="g" style="--w:150px">
      <div class="tenor-gif-embed" data-postid="16498763039499928961" data-share-method="host" data-aspect-ratio="1.33871" data-width="100%"><a href="https://tenor.com/view/spongebob-cant-wait-impatient-anxious-eagerly-gif-16498763039499928961">Spongebob Cant Wait GIF</a></div>
    </div>
  </div>
  <script async src="https://tenor.com/embed.js"></script>
  <script src="{{ asset('script.js') }}"></script>
</body>
</html>
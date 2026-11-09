<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Our date plan</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bagel+Fat+One&family=Figtree:wght@500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="{{ asset('style.css') }}">
</head>
<body>
  <main class="sheet">
    <h1 class="title">{{ $plan['to'] ?? null ? $plan['to'].' said yes' : 'She said yes' }}</h1>
    @include('partials.ticket')
    <div class="actions"><a class="btn yes" href="{{ route('home') }}">Make another plan</a></div>
  </main>
</body>
</html>

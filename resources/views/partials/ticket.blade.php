<div class="ticket">
  <div class="ticket-head">Date pass</div>
  <dl class="ticket-rows">
    <div><dt>We're having</dt><dd id="t-date">{{ $dateType ?? '—' }}</dd></div>
    <div><dt>On</dt><dd id="t-day">{{ $dayText ?? '—' }}</dd></div>
    <div><dt>At</dt><dd id="t-time">{{ $timeText ?? '—' }}</dd></div>
    <div><dt>Eating</dt><dd id="t-food">{{ $food ?? '—' }}</dd></div>
  </dl>
  <div class="ticket-stub">
    <img src="{{ asset('gif/cuddle-cute.gif') }}" alt="Two cartoon bears hugging" width="96" height="96">
    <p>Thank you for saying yes.<br><strong>I love you.</strong></p>
  </div>
</div>
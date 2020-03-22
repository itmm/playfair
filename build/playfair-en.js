"use strict";
window.addEventListener('load', () => {
 const norm = ch => {
  const u = ch.toUpperCase();
  if (u < 'A' || u > 'Z') { return null; }
  if (u === 'J') { return 'I'; }
  return u;
 };
 const build_table = key => {
  let result = "";
  let used = {};
  for (let i = 0; i < key.length; ++i) {
   const c = norm(key.charAt(i));
   if (! c || used[c]) { continue; }
   result += c;
   used[c] = true;
  }
  const base = "A".charCodeAt(0);
  for (let i = 0; i < 26; ++i) {
   const c = String.fromCharCode(base + i);
   if (used[c] || c === 'J') {
    continue;
   }
   result += c;
  }
  return result;
 };
 const assert = cond => {
  if (! cond) {
   console.error('unit-test failed');
  }
 };
 const check_table = (key, exp) => {
  const got = build_table(key);
  assert(got.length === 25);
  assert(got === exp);
 };
 const build_pairs = (table, enc) => {
  let pairs = {};
  const d = enc ? 1 : 4;
  for (let x1 = 0; x1 < 5; ++x1) {
   for (let y1 = 0; y1 < 5; ++y1) {
    const i1 = x1 + 5 * y1;
    const c1 = table.charAt(i1);
    for (let x2 = 0; x2 < 5; ++x2) {
     for (let y2 = 0; y2 < 5; ++y2) {
      const i2 = x2 + 5 * y2;
      const c2 = table.charAt(i2);
      let res = '';
      if (x1 === x2 && y1 === y2) {
       res = table.charAt((x1 + d) % 5 + 5 * ((y1 + d) % 5));
       res += res;
      } else if (y1 === y2) {
       res = table.charAt((x1 + d) % 5 + 5 * y1) +
        table.charAt((x2 + d) % 5 + 5 * y2);
      } else if (x1 === x2) {
       res = table.charAt(x1 + 5 * ((y1 + d) % 5)) +
        table.charAt(x2 + 5 * ((y2 + d) % 5));
      } else {
       res = table.charAt(x2 + 5 * y1) +
        table.charAt(x1 + 5 * y2);
      }
      pairs[c1 + c2] = res;
     }
    }
   }
  }
  return pairs;
 };
 const transform = (msg, enc, pairs) => {
  let last = '';
  let cur = '';
  let result = "";
  for (let i = 0; i < msg.length; ++i) {
   const c = norm(msg.charAt(i));
   if (! c) { continue; }
   if (enc && last === c) {
    cur += 'X'; last = ''; --i;
   } else {
    cur += c; last = c;
   }
   if (cur.length == 2) {
    result += pairs[cur];
    cur = '';
   }
  }
  if (cur) {
   result += pairs[cur + 'X'];
  }
  return result;
 }
 const check_playfair = (src, key, exp, norm) => {
  const table = build_table(key);
  const enc_pairs = build_pairs(table, true);
  const got = transform(src, true, enc_pairs);
  assert(got === exp);
  const dec_pairs = build_pairs(table, false);
  const plain = transform(got, false, dec_pairs);
  assert(plain === norm);
 };
 const unit_tests = () => {
  check_table("", "ABCDEFGHIKLMNOPQRSTUVWXYZ");
  check_table("playfair example", "PLAYFIREXMBCDGHKNOQSTUVWZ");
  check_playfair("", "bla", "", "");
  check_playfair(
   "Hide the gold in the tree stump", "playfair example",
   "BMODZBXDNABEKUDMUIXMMOUVIF", "HIDETHEGOLDINTHETREXESTUMP"
  );
  check_playfair("j", "bla", "GZ", "IX");
  check_playfair("box", "playfair", "RQFF", "BOXX");
  check_playfair("boxx", "playfair", "RQFFFF", "BOXXXX");
  check_playfair("boxxa", "playfair", "RQFFWY", "BOXXXA");
 };
 const query = window.location.search;
 if (query === "?unit-tests=true") {
  unit_tests();
 }
 const $key = document.getElementById('key');
 const $plain = document.getElementById('plain');
 const $cipher = document.getElementById('cipher');
 const $table = document.getElementById('table');
 const $direction = document.getElementById('direction');
 let encrypt = true;
 let table;
 let pairs;
 const msg_updated = () => {
  const msg = encrypt ? $plain.value : $cipher.value;
  const out = transform(msg, encrypt, pairs);
  if (encrypt) {
   $cipher.value = out;
  } else {
   $plain.value = out;
  }
 }
 const pairs_updated = () => {
  pairs = build_pairs(table, encrypt);
  msg_updated();
 };
 const table_updated = () => {
  table = build_table($key.value);
  let i = 0;
  for (let y = 0; y < 5; ++y) {
   for (let x = 0; x < 5; ++x) {
    $table.rows[y].cells[x].innerHTML = table.charAt(i++);
   }
  }
  pairs_updated();
 }
 table_updated();
 $key.addEventListener('input', evt => {
  evt.preventDefault();
  table_updated();
 });
 const update_msg = enc => {
  if (enc !== encrypt) {
   encrypt = enc;
   if (enc) {
    $direction.classList.add('flop');
    $direction.classList.remove('flip');
   } else {
    $direction.classList.add('flip');
    $direction.classList.remove('flop');
   }
   pairs_updated();
  } else {
   msg_updated();
  }
 };
 $plain.addEventListener('input', evt => {
  evt.preventDefault();
  update_msg(true);
 });
 $cipher.addEventListener('input', evt => {
  evt.preventDefault();
  update_msg(false);
 });
});

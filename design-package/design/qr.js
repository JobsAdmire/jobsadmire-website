/* Minimal QR encoder — byte mode, ECC level M, versions 1–10. window.JAQR.toDataURL(text, scale, border) */
(function (global) {
  var ECC_PER_BLOCK = [null, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26];
  var NUM_BLOCKS = [null, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5];

  function rawModules(ver) {
    var r = (16 * ver + 128) * ver + 64;
    if (ver >= 2) {
      var n = Math.floor(ver / 7) + 2;
      r -= (25 * n - 10) * n - 55;
      if (ver >= 7) r -= 36;
    }
    return r;
  }
  function totalCw(ver) { return Math.floor(rawModules(ver) / 8); }
  function dataCw(ver) { return totalCw(ver) - ECC_PER_BLOCK[ver] * NUM_BLOCKS[ver]; }

  function gfMul(x, y) {
    var z = 0;
    for (var i = 7; i >= 0; i--) {
      z = (z << 1) ^ ((z >>> 7) * 0x11D);
      z ^= ((y >>> i) & 1) * x;
    }
    return z & 0xFF;
  }
  function rsDivisor(degree) {
    var result = [], i, j;
    for (i = 0; i < degree - 1; i++) result.push(0);
    result.push(1);
    var root = 1;
    for (i = 0; i < degree; i++) {
      for (j = 0; j < result.length; j++) {
        result[j] = gfMul(result[j], root);
        if (j + 1 < result.length) result[j] ^= result[j + 1];
      }
      root = gfMul(root, 0x02);
    }
    return result;
  }
  function rsRemainder(data, divisor) {
    var result = divisor.map(function () { return 0; });
    data.forEach(function (b) {
      var factor = b ^ result.shift();
      result.push(0);
      divisor.forEach(function (d, i) { result[i] ^= gfMul(d, factor); });
    });
    return result;
  }

  function utf8(text) {
    var out = [], i, c;
    for (i = 0; i < text.length; i++) {
      c = text.charCodeAt(i);
      if (c < 0x80) out.push(c);
      else if (c < 0x800) { out.push(0xC0 | (c >> 6), 0x80 | (c & 0x3F)); }
      else { out.push(0xE0 | (c >> 12), 0x80 | ((c >> 6) & 0x3F), 0x80 | (c & 0x3F)); }
    }
    return out;
  }

  function encode(text, ver) {
    var bytes = utf8(text), bb = [], i, j;
    function push(val, len) { for (var k = len - 1; k >= 0; k--) bb.push((val >>> k) & 1); }
    push(4, 4);
    push(bytes.length, ver < 10 ? 8 : 16);
    for (i = 0; i < bytes.length; i++) push(bytes[i], 8);
    var cap = dataCw(ver) * 8;
    if (bb.length > cap) return null;
    push(0, Math.min(4, cap - bb.length));
    while (bb.length % 8 !== 0) bb.push(0);
    var dat = [];
    for (i = 0; i < bb.length; i += 8) {
      var v = 0;
      for (j = 0; j < 8; j++) v = (v << 1) | bb[i + j];
      dat.push(v);
    }
    for (var pad = 0xEC; dat.length < dataCw(ver); pad ^= 0xEC ^ 0x11) dat.push(pad);
    return dat;
  }

  function addEcc(data, ver) {
    var numBlocks = NUM_BLOCKS[ver], eccLen = ECC_PER_BLOCK[ver], raw = totalCw(ver);
    var numShort = numBlocks - raw % numBlocks, shortLen = Math.floor(raw / numBlocks);
    var div = rsDivisor(eccLen), blocks = [], k = 0, i;
    for (i = 0; i < numBlocks; i++) {
      var len = shortLen - eccLen + (i < numShort ? 0 : 1);
      var dat = data.slice(k, k + len);
      k += len;
      var ecc = rsRemainder(dat, div);
      if (i < numShort) dat = dat.concat([0]);
      blocks.push(dat.concat(ecc));
    }
    var result = [];
    for (i = 0; i < blocks[0].length; i++) {
      blocks.forEach(function (blk, j) {
        if (i !== shortLen - eccLen || j >= numShort) result.push(blk[i]);
      });
    }
    return result;
  }

  function alignPositions(ver) {
    if (ver === 1) return [];
    var n = Math.floor(ver / 7) + 2;
    var step = Math.ceil((ver * 4 + 4) / (n * 2 - 2)) * 2;
    var result = [6];
    for (var pos = ver * 4 + 10; result.length < n; pos -= step) result.splice(1, 0, pos);
    return result;
  }

  function build(ver, cw) {
    var size = ver * 4 + 17, mods = [], fn = [], x, y, i, j;
    for (y = 0; y < size; y++) {
      mods.push(new Array(size).fill(false));
      fn.push(new Array(size).fill(false));
    }
    function setFn(px, py, dark) {
      if (px < 0 || py < 0 || px >= size || py >= size) return;
      mods[py][px] = dark; fn[py][px] = true;
    }
    for (i = 0; i < size; i++) { setFn(6, i, i % 2 === 0); setFn(i, 6, i % 2 === 0); }
    function finder(cx, cy) {
      for (var dy = -4; dy <= 4; dy++) for (var dx = -4; dx <= 4; dx++) {
        var d = Math.max(Math.abs(dx), Math.abs(dy));
        setFn(cx + dx, cy + dy, d !== 2 && d !== 4);
      }
    }
    finder(3, 3); finder(size - 4, 3); finder(3, size - 4);
    var pos = alignPositions(ver);
    for (i = 0; i < pos.length; i++) for (j = 0; j < pos.length; j++) {
      if ((i === 0 && j === 0) || (i === 0 && j === pos.length - 1) || (i === pos.length - 1 && j === 0)) continue;
      for (var dy2 = -2; dy2 <= 2; dy2++) for (var dx2 = -2; dx2 <= 2; dx2++)
        setFn(pos[i] + dx2, pos[j] + dy2, Math.max(Math.abs(dx2), Math.abs(dy2)) !== 1);
    }
    if (ver >= 7) {
      var rem = ver;
      for (i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1F25);
      var vbits = (ver << 12) | rem;
      for (i = 0; i < 18; i++) {
        var bit = ((vbits >>> i) & 1) === 1;
        var a = size - 11 + i % 3, b = Math.floor(i / 3);
        setFn(a, b, bit); setFn(b, a, bit);
      }
    }
    // reserve format areas
    for (i = 0; i <= 8; i++) { setFn(8, i, false); setFn(i, 8, false); }
    for (i = 0; i < 8; i++) { setFn(size - 1 - i, 8, false); setFn(8, size - 1 - i, false); }

    // data
    var bi = 0;
    for (var right = size - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (var vert = 0; vert < size; vert++) {
        for (j = 0; j < 2; j++) {
          var xx = right - j;
          var upward = ((right + 1) & 2) === 0;
          var yy = upward ? size - 1 - vert : vert;
          if (!fn[yy][xx] && bi < cw.length * 8) {
            mods[yy][xx] = ((cw[bi >>> 3] >>> (7 - (bi & 7))) & 1) === 1;
            bi++;
          }
        }
      }
    }
    return { mods: mods, fn: fn, size: size };
  }

  function maskAt(m, x, y) {
    switch (m) {
      case 0: return (x + y) % 2 === 0;
      case 1: return y % 2 === 0;
      case 2: return x % 3 === 0;
      case 3: return (x + y) % 3 === 0;
      case 4: return (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0;
      case 5: return (x * y) % 2 + (x * y) % 3 === 0;
      case 6: return ((x * y) % 2 + (x * y) % 3) % 2 === 0;
      default: return ((x + y) % 2 + (x * y) % 3) % 2 === 0;
    }
  }

  function drawFormat(m, mods, fn, size) {
    var data = 0 << 3 | m; // ECC level M -> 0
    var rem = data, i;
    for (i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    var bits = ((data << 10) | rem) ^ 0x5412;
    function set(x, y, dark) { mods[y][x] = dark; fn[y][x] = true; }
    for (i = 0; i <= 5; i++) set(8, i, ((bits >>> i) & 1) === 1);
    set(8, 7, ((bits >>> 6) & 1) === 1);
    set(8, 8, ((bits >>> 7) & 1) === 1);
    set(7, 8, ((bits >>> 8) & 1) === 1);
    for (i = 9; i < 15; i++) set(14 - i, 8, ((bits >>> i) & 1) === 1);
    for (i = 0; i < 8; i++) set(size - 1 - i, 8, ((bits >>> i) & 1) === 1);
    for (i = 8; i < 15; i++) set(8, size - 15 + i, ((bits >>> i) & 1) === 1);
    set(8, size - 8, true);
  }

  function penalty(mods, size) {
    var score = 0, x, y, i, dark = 0;
    // rule 1: runs of 5+
    for (y = 0; y < size; y++) {
      var run = 1;
      for (x = 1; x < size; x++) {
        if (mods[y][x] === mods[y][x - 1]) { run++; if (run === 5) score += 3; else if (run > 5) score++; }
        else run = 1;
      }
    }
    for (x = 0; x < size; x++) {
      var runv = 1;
      for (y = 1; y < size; y++) {
        if (mods[y][x] === mods[y - 1][x]) { runv++; if (runv === 5) score += 3; else if (runv > 5) score++; }
        else runv = 1;
      }
    }
    // rule 2: 2x2 blocks
    for (y = 0; y < size - 1; y++) for (x = 0; x < size - 1; x++) {
      var c = mods[y][x];
      if (c === mods[y][x + 1] && c === mods[y + 1][x] && c === mods[y + 1][x + 1]) score += 3;
    }
    // rule 4: dark balance
    for (y = 0; y < size; y++) for (x = 0; x < size; x++) if (mods[y][x]) dark++;
    var pct = dark * 100 / (size * size);
    score += Math.floor(Math.abs(pct - 50) / 5) * 10;
    return score;
  }

  function toDataURL(text, scale, border, darkColor) {
    scale = scale || 4;
    border = border == null ? 2 : border;
    darkColor = darkColor || '#16202e';
    var ver, dat = null;
    for (ver = 1; ver <= 10; ver++) { dat = encode(text, ver); if (dat) break; }
    if (!dat) throw new Error('QR: text too long');
    var cw = addEcc(dat, ver);
    var best = null, bestScore = Infinity, m;
    for (m = 0; m < 8; m++) {
      var b = build(ver, cw);
      var y, x;
      for (y = 0; y < b.size; y++) for (x = 0; x < b.size; x++)
        if (!b.fn[y][x] && maskAt(m, x, y)) b.mods[y][x] = !b.mods[y][x];
      drawFormat(m, b.mods, b.fn, b.size);
      var s = penalty(b.mods, b.size);
      if (s < bestScore) { bestScore = s; best = b; }
    }
    var size = best.size, dim = (size + border * 2) * scale;
    var c = document.createElement('canvas');
    c.width = dim; c.height = dim;
    var ctx = c.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, dim, dim);
    ctx.fillStyle = darkColor;
    for (var yy = 0; yy < size; yy++) for (var xx = 0; xx < size; xx++)
      if (best.mods[yy][xx]) ctx.fillRect((xx + border) * scale, (yy + border) * scale, scale, scale);
    return c.toDataURL('image/png');
  }

  global.JAQR = { toDataURL: toDataURL };
})(window);

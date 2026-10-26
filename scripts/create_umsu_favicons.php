<?php

$sourcePath = __DIR__.'/../public/images/logo-umsu.png';
if (! file_exists($sourcePath)) {
    exit("Source logo not found at $sourcePath\n");
}

$src = imagecreatefrompng($sourcePath);
$srcW = imagesx($src);
$srcH = imagesy($src);

function createSquareLogo($src, $srcW, $srcH, $size)
{
    $canvas = imagecreatetruecolor($size, $size);
    imagealphablending($canvas, false);
    imagesavealpha($canvas, true);
    $transparent = imagecolorallocatealpha($canvas, 0, 0, 0, 127);
    imagefilledrectangle($canvas, 0, 0, $size, $size, $transparent);
    imagealphablending($canvas, true);

    // Calculate dimensions maintaining aspect ratio with small padding
    $pad = 0.04; // 4% padding
    $availH = $size * (1 - 2 * $pad);
    $availW = $size * (1 - 2 * $pad);

    $scale = min($availW / $srcW, $availH / $srcH);
    $dstW = (int) round($srcW * $scale);
    $dstH = (int) round($srcH * $scale);

    $dstX = (int) round(($size - $dstW) / 2);
    $dstY = (int) round(($size - $dstH) / 2);

    imagecopyresampled($canvas, $src, $dstX, $dstY, 0, 0, $dstW, $dstH, $srcW, $srcH);
    imagealphablending($canvas, false);
    imagesavealpha($canvas, true);

    return $canvas;
}

// 1. Generate PNGs: 16x16, 32x32, 48x48, 180x180, 512x512
$sizes = [16, 32, 48, 180, 512];
$pngBuffers = [];

foreach ($sizes as $s) {
    $img = createSquareLogo($src, $srcW, $srcH, $s);
    ob_start();
    imagepng($img);
    $pngData = ob_get_clean();
    $pngBuffers[$s] = $pngData;
    imagedestroy($img);
}

// Save standalone PNGs
file_put_contents(__DIR__.'/../public/favicon-16x16.png', $pngBuffers[16]);
file_put_contents(__DIR__.'/../public/favicon-32x32.png', $pngBuffers[32]);
file_put_contents(__DIR__.'/../public/apple-touch-icon.png', $pngBuffers[180]);
file_put_contents(__DIR__.'/../public/apple-touch-icon-precomposed.png', $pngBuffers[180]);

// 2. Build multi-resolution ICO file with 16x16, 32x32, 48x48 PNGs
$icoSizes = [16, 32, 48];
$header = pack('vvv', 0, 1, count($icoSizes)); // Reserved (0), Type (1=ICO), Count (3)
$entryOffset = 6 + (16 * count($icoSizes));

$entries = '';
$data = '';

foreach ($icoSizes as $s) {
    $png = $pngBuffers[$s];
    $pngLen = strlen($png);
    $w = ($s >= 256) ? 0 : $s;
    $h = ($s >= 256) ? 0 : $s;

    // ICONDIRENTRY: w, h, colors(0), reserved(0), planes(1), bpp(32), size, offset
    $entries .= pack('CCCCvvVV', $w, $h, 0, 0, 1, 32, $pngLen, $entryOffset);
    $data .= $png;
    $entryOffset += $pngLen;
}

file_put_contents(__DIR__.'/../public/favicon.ico', $header.$entries.$data);

// 3. Build favicon.svg with embedded base64 of the high-res 512x512 UMSU logo
$base64Png = base64_encode($pngBuffers[512]);
$svgContent = <<<SVG
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <image href="data:image/png;base64,{$base64Png}" width="512" height="512" preserveAspectRatio="xMidYMid meet"/>
</svg>

SVG;

file_put_contents(__DIR__.'/../public/favicon.svg', $svgContent);

echo "Successfully generated all UMSU favicons!\n";

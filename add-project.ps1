Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
$catalog = Join-Path $PSScriptRoot 'assets\js\projects.js'
$utf8 = New-Object System.Text.UTF8Encoding($false)
$source = [IO.File]::ReadAllText($catalog, [Text.Encoding]::UTF8)
$form = New-Object Windows.Forms.Form
$form.Text = 'Добавить проект в портфолио'
$form.ClientSize = New-Object Drawing.Size(540, 470)
$form.StartPosition = 'CenterScreen'
$form.FormBorderStyle = 'FixedDialog'
$form.MaximizeBox = $false
function LabelAt($text, $y) {
  $label = New-Object Windows.Forms.Label
  $label.Text = $text; $label.SetBounds(20, $y, 500, 22); $form.Controls.Add($label)
}
function TextAt($y, $height = 25) {
  $box = New-Object Windows.Forms.TextBox
  $box.SetBounds(20, $y, 495, $height); $form.Controls.Add($box); return $box
}
LabelAt 'Название проекта' 15
$title = TextAt 38
LabelAt 'Категория' 72
$category = New-Object Windows.Forms.ComboBox
$category.SetBounds(20, 95, 495, 25); $category.DropDownStyle = 'DropDownList'
foreach ($match in [regex]::Matches($source, '(?m)^    id: "([^"]+)"[^\r\n]*\r?\n    title: "([^"]+)"')) {
  [void]$category.Items.Add(($match.Groups[1].Value + ' — ' + $match.Groups[2].Value))
}
if ($category.Items.Count -gt 0) { $category.SelectedIndex = 0 }
$form.Controls.Add($category)
LabelAt 'Папка с фотографиями (по имени файла; первая — обложка)' 130
$folder = TextAt 153
$folder.Width = 395
$browse = New-Object Windows.Forms.Button
$browse.Text = 'Выбрать…'; $browse.SetBounds(425, 151, 90, 28)
$browse.Add_Click({ $dialog = New-Object Windows.Forms.FolderBrowserDialog; if ($dialog.ShowDialog() -eq 'OK') { $folder.Text = $dialog.SelectedPath } })
$form.Controls.Add($browse)
LabelAt 'Краткое описание' 190
$description = TextAt 213
LabelAt 'История съёмки' 250
$story = TextAt 273 100; $story.Multiline = $true; $story.ScrollBars = 'Vertical'
$save = New-Object Windows.Forms.Button
$save.Text = 'Добавить проект'; $save.SetBounds(355, 400, 160, 35)
$save.Add_Click({
  $target = $null
  try {
    if (-not $title.Text.Trim() -or -not $category.SelectedItem -or -not (Test-Path -LiteralPath $folder.Text -PathType Container)) { throw 'Укажите название, категорию и папку с фотографиями.' }
    $photos = @(Get-ChildItem -LiteralPath $folder.Text -File | Where-Object { $_.Extension.ToLowerInvariant() -in @('.jpg', '.jpeg', '.png', '.webp', '.avif') } | Sort-Object Name)
    if (-not $photos.Count) { throw 'В папке нет фотографий JPG, PNG, WebP или AVIF.' }
    $text = [IO.File]::ReadAllText($catalog, [Text.Encoding]::UTF8)
    $pattern = '(?s)(// EXTRA_PROJECTS_START\s*const extraProjects = )(.*?)(;\s*// EXTRA_PROJECTS_END)'
    $match = [regex]::Match($text, $pattern)
    if (-not $match.Success) { throw 'Не найден раздел проектов помощника в каталоге.' }
    $existing = @($match.Groups[2].Value | ConvertFrom-Json)
    $id = 'project-' + [guid]::NewGuid().ToString('N').Substring(0, 10)
    $target = Join-Path $PSScriptRoot "assets\images\projects\$id"
    New-Item -ItemType Directory -Path $target -ErrorAction Stop | Out-Null
    $entries = @(); $i = 0
    foreach ($photo in $photos) {
      $i++; $name = ('{0:D2}' -f $i) + $photo.Extension.ToLowerInvariant()
      Copy-Item -LiteralPath $photo.FullName -Destination (Join-Path $target $name) -ErrorAction Stop
      $entries += @{ src = "assets/images/projects/$id/$name"; alt = "$($title.Text.Trim()) — фотография $i" }
    }
    $project = @{ categoryId = ($category.SelectedItem.ToString() -split ' — ')[0]; id = $id; title = $title.Text.Trim(); subtitle = $description.Text.Trim(); summary = $description.Text.Trim(); story = $story.Text.Trim(); photos = $entries }
    $existing += $project
    $json = ConvertTo-Json -InputObject @($existing) -Depth 8
    $updated = $text.Substring(0, $match.Index) + $match.Groups[1].Value + $json + $match.Groups[3].Value + $text.Substring($match.Index + $match.Length)
    [IO.File]::WriteAllText($catalog, $updated, $utf8)
    [Windows.Forms.MessageBox]::Show("Проект добавлен: $i фото. Проверьте сайт и загрузите изменения на GitHub.", 'Готово') | Out-Null
    $form.Close()
  } catch {
    if ($target -and (Test-Path -LiteralPath $target)) { Remove-Item -LiteralPath $target -Recurse -Force }
    [Windows.Forms.MessageBox]::Show($_.Exception.Message, 'Не удалось добавить проект') | Out-Null
  }
})
$form.Controls.Add($save)
[void]$form.ShowDialog()

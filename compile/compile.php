<?php
echo 'Start working...' . PHP_EOL;
$scriptsPath = __DIR__ . '/../src/scripts';
$templatesPath = __DIR__ . '/../src/templates';

$repository = new repositoryFile();
$template = new template();

$scriptJs = $repository->getFileName($scriptsPath . '/' . "*.min.js");
if ($scriptJs == null) {
    die('*.min.js not found');
}

echo 'Found ' . $scriptJs . PHP_EOL;
$jsLib = $repository->getLibName($scriptJs);

echo 'Read js files...' . PHP_EOL;
$directives = $repository->readFiles($scriptsPath . '/directives/');
echo 'Read html files...' . PHP_EOL;
$templates = $repository->readFiles($templatesPath . '/directives/');

echo 'Create library ' . $jsLib . PHP_EOL;
$jsFile = fopen($scriptJs, 'r');
$contentJs = fread($jsFile, filesize($scriptJs));
fclose($jsFile);

$templateName = $template->getTemplateByName($directives);

$compileTemplates = [];
foreach ($templateName as $key => $value) {
    $compileTemplates[] = $template->createModuleByTemplate($templates[$key], $value);
}

$libFile = fopen($scriptsPath . '/' . $jsLib, 'w');
fwrite($libFile, $contentJs);
fwrite($libFile, $template->angularTemplate($contentJs, $templateName));
foreach($directives as $key => $value) {
    fwrite($libFile, str_replace("'use strict';", "", $value));
}
foreach($compileTemplates as $key => $value) {
    fwrite($libFile, $value);
}
fclose($libFile);
echo 'Finished';

// Class repositoryFile
class repositoryFile {
    public function getLibName($file) {
        return str_replace(".min", "", basename(str_replace("\\", "/", $file)));        
    }
    public function getFileName($path) {
        foreach(glob($path) as $file)
        {
            if(is_file($file)) {
                return $file;
            }
        }
        return null;
    }
    public function readFiles($path) {
        $fs = [];
        $files = scandir($path);
        foreach ($files as $file) {
            $fname = $path . $file;
            if(is_file($fname)) {
                echo $file . PHP_EOL;
                $f = fopen($fname, 'r');
                $fs[$file] = fread($f, filesize($fname));
                fclose($f);        
            }
        }
        return $fs;
    }
}

// Class template
class template {
    public function createModuleByTemplate($template, $name) {
        $template = str_replace("\"", "\\\"", $template);
        $template = str_replace("/\r/", "", $template);
        $tmp = preg_split("/\n/", $template);
        $tmp1 = [];
        for($i = 0; $i < count($tmp); $i++) {
            if(strlen($tmp[$i]) > 0) {
                array_push($tmp1, $tmp[$i]);
            }
        }
        for($i = 0; $i < count($tmp1); $i++) {
            if(strlen($tmp[$i]) > 0) {
                if($i == 0) {
                    $tmp1[$i] = "\t" . '"' . rtrim($tmp1[$i]) . "\"";
                } else {
                    $tmp1[$i] = "\t" . '"' . rtrim($tmp1[$i]) . "\"";
                }
            }
        }
        $template = implode(" +\n", $tmp1);
        return PHP_EOL . 'angular.module("' . $name . '", []).run(["$templateCache", function($templateCache) {' . PHP_EOL .
            '$templateCache.put("' . $name . '",' . PHP_EOL .
            $template . PHP_EOL .
            ');' . PHP_EOL .
        '}]);' . PHP_EOL;
    }
    public function getTemplateByName($data) {
        $templatesName = [];
        foreach ($data as $key => $value) {
            $tmpStr = stristr($value, 'templateUrl');
            if ($tmpStr) {
                $tmp = preg_split("/'/", $tmpStr);
                $tmpFilename = preg_split("/\//", $tmp[1]);
                $templatesName[array_pop($tmpFilename)] = $tmp[1];
            }
        }
        return $templatesName;
    }
    public function angularTemplate($content, $template) {
        $tmpStr = stristr($content, "angular.module('");
        $module = null;
        if ($tmpStr) {
            $tmp = preg_split("/'/", $tmpStr);
            $module = $tmp[1];
        }
        $str = "angular.module('{$module}.templates', [";
        $i = 0;
        foreach ($template as $k => $v) {
            $str .= "'$v'";
            if($i < count($template) - 1) {
                $str .= ', ';
            }
            $i++;
        }
        $str .= ']);' . PHP_EOL . PHP_EOL;
        return PHP_EOL . $str;
    }
}
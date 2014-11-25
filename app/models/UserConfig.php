<?php

class UserConfig extends User {
	private $userPath;
	private $configPath;
	private $contents;

	public function __construct($username) {
		parent::__construct($username);

		$this->userPath = storage_path() . DIRECTORY_SEPARATOR . 'users' . DIRECTORY_SEPARATOR . $this->username;
		if (!file_exists($this->userPath)) {
		    mkdir($this->userPath, 0777, true);
		}

		$this->configPath = $this->userPath . DIRECTORY_SEPARATOR . 'config.json';
		if (!file_exists($this->configPath)) {
			$file = fopen($this->configPath, 'w');
			$this->setDefaultConfig($file);
			fclose($file);
		}

		$this->contents = json_decode(file_get_contents($this->configPath), true);
	}

	public function setData($key, $val) {
		$location = &$this->getArrayLocation($this->contents, $key);
		$location = $val; 
		$this->saveDataToFile($this->configPath, $this->contents, true);
	}
	public function getData($key = null) {
		if (!$key) {
			return $this->contents;
		}

		$location = $this->getArrayLocation($this->contents, $key);
		return $location;
	}
	public function setDefaults() {
		$this->setDefaultConfig();
	}

	private function saveDataToFile($filePath, $data, $jsonEncode = false) {
		$file = fopen($filePath, 'w');
		if ($jsonEncode == true) {
			$data = json_encode($data);
		}
		fwrite($file, $data);
		fclose($file);
	}
	private function setDefaultConfig($file, $closeResource = false) {
		$defaultsFilePath = storage_path() . DIRECTORY_SEPARATOR . 'users' . DIRECTORY_SEPARATOR . 'default-config.json';
		$defaultContent = file_get_contents($defaultsFilePath);
		fwrite($file, $defaultContent);
		if ($closeResource == true) {
			fclose($file);
		}
	}
	private function &getArrayLocation(&$array, $key) {
		$keys = explode('.', $key);
		foreach ($keys as $key) {
			// Working with reference of the array.
			if (!isset($location)) {
				$location = &$array[$key];
			}
			else {
				$location = &$location[$key];
			}
		}
		return $location;
	}
}
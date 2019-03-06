;
(function () {
	'use scrict';

	translationsEN = {
		'mainButton': 'Main',
		'odoButton': 'Odometer',
		'diagnosticsButton': 'Diagnostics',
		'powerControlButton': 'PowerCtrl',
		'schedulerButton': 'Scheduler',
		'signalsButton': 'Signals',
		'upsButton': 'UPS Status',
		'MAIN_TITLE': 'OBM Control System',
		'BUTTON_LANG_DE': 'Deutsch',
		'BUTTON_LANG_EN': 'English',
		'BUTTON_LANG_RU': 'Русский',
		'WEB_SITE': 'Web-site',
		'SPC_INFOTRANS': 'SPC INFOTRANS',
		'LEGAL_INFO': 'Legal Info',
		'_main': 'Main',
		'_power': 'Power',
		'_odo': 'Odometer',
		'_diag': 'Diagnostics',
		'_tasks': 'Scheduler',
		'_alarms': 'Alarms',
		'_settings': 'Settings',
		'_connlost': 'Server connection lost',
		'_save': 'Save',
		'create_new_task': 'Create New Task',

		'ON': 'ON',
		'WAIT': 'WAIT',
		'OFF': 'OFF',
		'NA': 'n/a',
		'ERROR': 'ERROR',

		'degC': '°C',

		'MR_STAND_BY': 'StandBy',
		'MR_PRE_STAND_BY': 'Pre StandBy',
		'MR_MEASURE': 'Measure',
		'MR_READY': 'Ready',
		'MR_RUN_READY': 'Starting...',
		'MR_RUN_MEASURE': 'Starting measure...',
		'MR_RUN_STAND_BY': 'Stopping...',
		'MR_OFF': 'System Off',
		'MR_ERROR': 'System Error!',
		'MR_RUN_OFF': 'Shutdown...',
		'_STDBY': 'StdBy',
		'_OFF': 'OFF',
		'_OFFALL': 'Switch Off',
		'_ON': 'ON',
		'_START': 'Start',
		'_STOP': 'Stop',
		'_title': 'Title',
		'_timestart': 'Time of start',
		'_timeend': 'Time of end',
		'_finished': 'Finished',
		'_delete': 'Delete',
		'_upserror': 'UPS Error',
		'_error': 'Fehler',
		'_emulatorspeed': 'Emulator speed',
		'_emulatordirection': 'Emulator direction',
		'_emulatormode': 'Emulator mode',
		'_forward': 'Forward',
		'_backward': 'Backward',
		'_powersupply': 'Power and supply',
		'_centralsystem': 'Central system',
		'_auxsystem': 'Aux systems',
		'_networks': 'Networks',
		'_sensors': 'Sensors',
		'_storage': 'Storage',
		'_automode': 'Auto',
		'_manualmode': 'Manual',
		'_speed': 'Speed',
		'CENTRAL_SYSTEM': 'Central system',
		'ses': 'SES',
		'UPS': 'UPS',
		'Units': 'Units',
		'MAIN_ERROR': 'Server connection error!',
		'control_mode': 'Control mode',
		'max_frame_temp': 'Maximal frame temperature alarm',
		'max_frame_sign': 'Max frame sign',
		'automeasure_speed_record': 'Automeasure speed threshold',
		'automeasure_staying_time': 'Automeasure staying time',
		'debug': 'Debug mode',
		'send_data_email': 'Email for sending data',
		'send_data_sms': 'Mobile number for sending sms',
		'wheel_d': 'Odometer wheel diameter',
		'cut_measure': 'Cut Measure',
		'balis_speed_on': 'Balisa switch on speed',
		'balis_speed_off': 'Balisa switch off speed',
		'ext_power_time': 'Time to work on Battery',
		'ext_power_runtime': 'Remaining battery time alarm',

		'y_axle_12_sens_k':	'Transversal acceleration on the axle-box Y 12, K',
		'y_axle_11_sens_k':	'Transversal acceleration on the axle-box Y 11, K',
		'y_axle_21_sens_k':	'Transversal acceleration on the axle-box Y 21, K',
		'y_axle_22_sens_k':	'Transversal acceleration on the axle-box Y 22, K',
		'y_axle_42_sens_k':	'Transversal acceleration on the axle-box Y 42, K',
		'y_axle_41_sens_k':	'Transversal acceleration on the axle-box Y 41, K',
		'z_axle_11_sens_k':	'Vertical acceleration on the axle-box Z 11, K',
		'z_axle_12_sens_k':	'Vertical acceleration on the axle-box Z 12, K',
		'z_axle_21_sens_k':	'Vertical acceleration on the axle-box Z 21, K',
		'z_axle_22_sens_k':	'Vertical acceleration on the axle-box Z 22, K',
		'z_axle_41_sens_k':	'Vertical acceleration on the axle-box Z 41, K',
		'z_axle_42_sens_k':	'Vertical acceleration on the axle-box Z 42, K',
		'y_bogie_1_sens_k':	'Transversal acceleration of the bogie frame Y 1, K',
		'y_bogie_2_sens_k':	'Transversal acceleration of the bogie frame Y 2, K',
		'y_bogie_3_sens_k':	'Transversal acceleration of the bogie frame Y 3, K',
		'y_bogie_4_sens_k':	'Transversal acceleration of the bogie frame Y 4, K',
		'y_body_I_sens_k':	'Transversal acceleration of the vehicle’s body over kingpin I, K',
		'y_body_II_sens_k':	'Transversal acceleration of the vehicle’s body over kingpin II, K',
		'z_body_I_sens_k':	'Vertical acceleration of the vehicle’s body over kingpin I, K',
		'z_body_II_sens_k':	'Vertical acceleration of the vehicle’s body over kingpin II, K',


		'y_axle_12_sens_b':	'Transversal acceleration on the axle-box Y 12, B',
		'y_axle_11_sens_b':	'Transversal acceleration on the axle-box Y 11, B',
		'y_axle_42_sens_b':	'Transversal acceleration on the axle-box Y 42, B',
		'y_axle_41_sens_b':	'Transversal acceleration on the axle-box Y 41, B',
		'z_axle_11_sens_b':	'Vertical acceleration on the axle-box Z 11, B',
		'z_axle_12_sens_b':	'Vertical acceleration on the axle-box Z 12, B',
		'z_axle_41_sens_b':	'Vertical acceleration on the axle-box Z 41, B',
		'z_axle_42_sens_b':	'Vertical acceleration on the axle-box Z 42, B',
		'y_bogie_1_sens_b':	'Transversal acceleration of the bogie frame Y 1, B',
		'y_bogie_2_sens_b':	'Transversal acceleration of the bogie frame Y 2, B',
		'y_bogie_3_sens_b':	'Transversal acceleration of the bogie frame Y 3, B',
		'y_bogie_4_sens_b':	'Transversal acceleration of the bogie frame Y 4, B',
		'y_body_I_sens_b':	'Transversal acceleration of the vehicle’s body over kingpin I, B',
		'y_body_II_sens_b':	'Transversal acceleration of the vehicle’s body over kingpin II, B',
		'z_body_I_sens_b':	'Vertical acceleration of the vehicle’s body over kingpin I, B',
		'z_body_II_sens_b':	'Vertical acceleration of the vehicle’s body over kingpin II, B',

		

	}

	translationsRU = {



	}

	translationsDE = {

	}

	angular
		.module('obm.translate', [
			'pascalprecht.translate'

		])
		.config(configTranslate)
		.controller('TransCtrl', TranslateController);

	function configTranslate($translateProvider) {
		$translateProvider.translations('en', translationsEN);
		$translateProvider.translations('ru', translationsRU);

		$translateProvider.preferredLanguage('en');
		$translateProvider.fallbackLanguage('en');
	}

	function TranslateController($translate, $scope, localStorage) {
		//console.log('Language ctrl');

		var lk = localStorage.getItem('language-obm');

		if (!(lk == null)) {
			//console.log(lk);
			$translate.use(lk);
		}


		$scope.changeLanguage = function (langKey) {
			//console.log('Language change ' + langKey);
			$translate.use(langKey);
			localStorage.setItem('language-obm', langKey);
		};
	}

})();
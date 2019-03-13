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
		'balis_speed_on': 'ETCS Balise Reader switch on speed',
		'balis_speed_off': 'ETCS Balise Reader switch off speed',
		'ext_power_time': 'Time to work on Battery',
		'ext_power_runtime': 'Remaining battery time alarm',

		'Balisa':'ETCS Balise Reader',
		'DYNSYS':'Axle box acceleration sensors',

		'y_axle_11_sens_k':'y_axle_11_sens, K',
		'y_axle_12_sens_k':'y_axle_12_sens, K',
		'y_axle_21_sens_k':'y_axle_21_sens, K',
		'y_axle_22_sens_k':'y_axle_22_sens, K',
		'y_axle_42_sens_k':'y_axle_42_sens, K',
		'y_axle_41_sens_k':'y_axle_41_sens, K',
		'z_axle_11_sens_k':'z_axle_11_sens, K',
		'z_axle_12_sens_k':'z_axle_12_sens, K',
		'z_axle_21_sens_k':'z_axle_21_sens, K',
		'z_axle_22_sens_k':'z_axle_22_sens, K',
		'z_axle_41_sens_k':'z_axle_41_sens, K',
		'z_axle_42_sens_k':'z_axle_42_sens, K',
		'y_bogie_1_sens_k':'y_bogie_1_sens, K',
		'y_bogie_2_sens_k':'y_bogie_2_sens, K',
		'y_bogie_3_sens_k':'y_bogie_3_sens, K',
		'y_bogie_4_sens_k':'y_bogie_4_sens, K',
		'y_body_I_sens_k' : 'y_body_I_sens, K',
		'y_body_II_sens_k':'y_body_II_sens, K',
		'z_body_I_sens_k' : 'z_body_I_sens, K', 
		'z_body_II_sens_k':'z_body_II_sens, K',

		'y_axle_11_sens_b':'y_axle_11_sens, B',
		'y_axle_12_sens_b':'y_axle_12_sens, B',
		'y_axle_21_sens_b':'y_axle_21_sens, B',
		'y_axle_22_sens_b':'y_axle_22_sens, B',
		'y_axle_42_sens_b':'y_axle_42_sens, B',
		'y_axle_41_sens_b':'y_axle_41_sens, B',
		'z_axle_11_sens_b':'z_axle_11_sens, B',
		'z_axle_12_sens_b':'z_axle_12_sens, B',
		'z_axle_21_sens_b':'z_axle_21_sens, B',
		'z_axle_22_sens_b':'z_axle_22_sens, B',
		'z_axle_41_sens_b':'z_axle_41_sens, B',
		'z_axle_42_sens_b':'z_axle_42_sens, B',
		'y_bogie_1_sens_b':'y_bogie_1_sens, B',
		'y_bogie_2_sens_b':'y_bogie_2_sens, B',
		'y_bogie_3_sens_b':'y_bogie_3_sens, B',
		'y_bogie_4_sens_b':'y_bogie_4_sens, B',
		'y_body_I_sens_b' : 'y_body_I_sens, B',
		'y_body_II_sens_b':'y_body_II_sens, B',
		'z_body_I_sens_b' : 'z_body_I_sens, B', 
		'z_body_II_sens_b':'z_body_II_sens, B',
		
		'aq_sens_k':'aq_sens, K',
		'aq_sens_b':'aq_sens, B',

		'z_d_ps_11_k':'z_d_ps_11, K',
		'z_d_ps_11_b':'z_d_ps_11, b',
		'z_d_ps_12_k':'z_d_ps_12, K',
		'z_d_ps_12_b':'z_d_ps_12, b',
		'z_d_ps_21_k':'z_d_ps_21, K',
		'z_d_ps_21_b':'z_d_ps_21, b',
		'z_d_ps_22_k':'z_d_ps_22, K',
		'z_d_ps_22_b':'z_d_ps_22, b'
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
module.exports = {
	'ENCRYPT_STRING' : {
		'START_SYMBOL' : '{!!!{',
		'END_SYMBOL' : '}!!!}'
	},
	'STATUS_CODE': { 
		'SUCCESS': '1',
		'FAIL': '0',
		'VALIDATION': '2',
		'UNAUTHENTICATED': '-1',
		'NOT_FOUND': '-2'
	},
	'PROFILE_IMG_PATH': 'public/images/profile_pic',
	'PROFILE_IMG_URL': 'images/profile_pic',
	'ANGULAR_BASE_URL' : 'http://127.0.0.1:4200/reset-password',
	'COMMONAPP_LOGO': 'images/logo',
    'COMMONAPP_LOGO_IMAGE': 'commonApp.jpg',
	'EMAIL_FROM':"admin@commonapp.com",
	'USER_TYPE' : {
		'ADMIN' : 1,
		'USER' : 2
	},
	'PAGE' : 0,
	'LIMIT' : 10,
	'STATUS' : {
		'INACTIVE' : 0,
		'ACTIVE' : 1
	},
	'VERSION_STATUS':{
		'NO_UPDATE':0,
		'OPTIONAL_UPDATE':1,
		'FORCE_UPDATE':2
	},
	'MULTIPLE_DEVICE_LOGIN' : true,
	'TOKEN_EXPIRE_TIME' : '365d',
}
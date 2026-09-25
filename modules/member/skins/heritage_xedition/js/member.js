function completeInsert(ret_obj, response_tags, args, fo_obj) {
    var error = ret_obj['error'];
    var message = ret_obj['message'];
    var redirect_url = ret_obj['redirect_url'];

    alert(message);

    if(current_url.getQuery('popup')==1) {
        if(typeof(opener)!='undefined') opener.location.reload();
        window.close();
    } else {
        if(redirect_url) location.href = redirect_url;
        else location.href = current_url.setQuery('act','');
    }
}

function completeModify(ret_obj, response_tags, args, fo_obj) {
    var error = ret_obj['error'];
    var message = ret_obj['message'];

    alert(message);

    location.href = current_url.setQuery('act','dispMemberInfo');
}

function completeLeave(ret_obj, response_tags, args, fo_obj) {
    var error = ret_obj['error'];
    var message = ret_obj['message'];

    alert(message);

    location.href = current_url.setQuery('act','');
}

function _doUploadImage(fo_obj, act) {
    fo_obj.act.value = act;
    fo_obj.submit();
}

function doUploadProfileImage() {
    var fo_obj = get_by_id("fo_insert_member");
    if(!fo_obj.profile_image.value) return;
    _doUploadImage(fo_obj, 'procMemberInsertProfileImage');
}
function doUploadImageName() {
    var fo_obj = get_by_id("fo_insert_member");
    if(!fo_obj.image_name.value) return;
    _doUploadImage(fo_obj, 'procMemberInsertImageName');
}

function doUploadImageMark() {
    var fo_obj = get_by_id("fo_insert_member");
    if(!fo_obj.image_mark.value) return;
    _doUploadImage(fo_obj, 'procMemberInsertImageMark');
}

function completeLogin(ret_obj, response_tags, params, fo_obj) {
    if(fo_obj.remember_user_id && fo_obj.remember_user_id.checked) {
        var expire = new Date();
        expire.setTime(expire.getTime()+ (7000 * 24 * 3600000));
        setCookie('user_id', fo_obj.user_id.value, expire);
    }

    var url =  current_url.setQuery('act','');
    location.href = current_url.setQuery('act','');
}

function completeLogout(ret_obj) {
    location.href = current_url.setQuery('act','');
}

function completeResendAuthMail(ret_obj, response_tags) {
	var error = ret_obj['error'];
    var message =  ret_obj['message'];

    if(message) alert(message);
	if(error != 0) alert(error);
}

function doDeleteProfileImage(member_srl) {
	if (!member_srl) return;

	if (!confirm(xe.lang.deleteProfileImage)) return false;

	exec_xml(
		'member',
		'procMemberDeleteProfileImage',
		{member_srl:member_srl},
		function(){jQuery('#profile_imagetag').remove()},
		['error','message']
	);
}

function doDeleteImageName(member_srl) {
	if (!member_srl) return;

	if (!confirm(xe.lang.deleteImageName)) return false;
	exec_xml(
		'member',
		'procMemberDeleteImageName',
		{member_srl:member_srl},
		function(){jQuery('#image_nametag').remove()},
		['error','message']
	);
}

function doDeleteImageMark(member_srl) {
	if (!member_srl) return;

	if (!confirm(xe.lang.deleteImageMark)) return false;
	exec_xml(
		'member',
		'procMemberDeleteImageMark',
		{member_srl:member_srl},
		function(){jQuery('#image_marktag').remove()},
		['error','message']
	);
}

function doDeleteScrap(document_srl) {
    var params = new Array();
    params['document_srl'] = document_srl;
    exec_json('member.procMemberDeleteScrap', params, function(data) {
		alert(data.message);
		location.reload();
	});
}

function completeFindMemberAccount(ret_obj, response_tags) {
    alert(ret_obj['message']);
}

function completeFindMemberAccountByQuestion(ret_obj, response_tags) {
    if(ret_obj['error'] != 0){
		alert(ret_obj['message']);
	}else{
		location.href = current_url.setQuery('act','dispMemberGetTempPassword').setQuery('user_id',ret_obj['user_id']);
	}
}

function doDeleteSavedDocument(document_srl, confirm_message) {
    if(!confirm(confirm_message)) return false;

    var params = new Array();
    params['document_srl'] = document_srl;
    exec_json('member.procMemberDeleteSavedDocument', params, function() { location.reload(); });
}

function insertSelectedModule(id, module_srl, mid, browser_title) {
    location.href = current_url.setQuery('selected_module_srl',module_srl);
}

jQuery(function($) {
	$("#scrap_folder_create").on("click", function() {
		var input = $(this).siblings("input.folder_name").first();
		if (!input.is(":visible")) {
			input.show();
		} else {
			if (!input.val()) return;
			var params = { name: input.val() };
			exec_json('member.procMemberInsertScrapFolder', params, function(data) {
				window.location.href = current_url.setQuery("folder_srl", data.folder_srl);
			});
		}
	});
	$("#scrap_folder_rename").on("click", function() {
		var folder_srl = $(this).data("folder-srl");
		var input = $(this).siblings("input.folder_name").first();
		if (!input.is(":visible")) {
			input.show();
		} else {
			if (!input.val()) return;
			var params = { folder_srl: folder_srl, name: input.val() };
			exec_json('member.procMemberRenameScrapFolder', params, function() {
				window.location.reload();
			});
		}
	});
	$("#scrap_folder_delete").on("click", function() {
		var folder_srl = $(this).data("folder-srl");
		var params = { folder_srl: folder_srl };
		exec_json('member.procMemberDeleteScrapFolder', params, function() {
			window.location.href = current_url.setQuery("folder_srl", "");
		});
	});
	$("#scrap_folder_list").on("change", function() {
		window.location.href = current_url.setQuery("folder_srl", $(this).val());
	});
	$(".scrap_folder_move").on("change", function() {
		var document_srl = $(this).data('document-srl');
		var folder_srl = $(this).val();
		if (!folder_srl) return;
		var params = { document_srl: document_srl, folder_srl: folder_srl };
		exec_json('member.procMemberMoveScrapFolder', params, function() {
			window.location.reload();
		});
	});
});

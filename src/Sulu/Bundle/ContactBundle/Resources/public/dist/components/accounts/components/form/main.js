define(["config","widget-groups"],function(a,b){"use strict";var c={headline:"contact.accounts.title"},d=["urls","emails","faxes","phones","notes","addresses"],e={tagsId:"#tags",addressAddId:"#address-add",addAddressWrapper:".grid-row",bankAccountsId:"#bankAccounts",bankAccountAddSelector:".bank-account-add"},f={addBankAccountsIcon:['<div class="grid-row">','    <div class="grid-col-12">','       <span id="bank-account-add" class="fa-plus-circle icon bank-account-add clickable pointer m-left-140"></span>',"   </div>","</div>"].join("")};return{view:!0,layout:function(){return{content:{width:"fixed"},sidebar:{width:"max",cssClasses:"sidebar-padding-50"}}},templates:["/admin/contact/template/account/form"],customTemplates:{addAddressesIcon:['<div class="grid-row">','    <div class="grid-col-12">','       <span id="address-add" class="fa-plus-circle icon address-add clickable pointer m-left-140"></span>',"   </div>","</div>"].join("")},initialize:function(){this.options=this.sandbox.util.extend(!0,{},c,this.options),this.form="#contact-form",this.formContactFields="#contact-fields",this.saved=!0,this.autoCompleteInstanceName="contacts-",this.dfdListenForChange=this.sandbox.data.deferred(),this.dfdFormIsSet=this.sandbox.data.deferred(),this.instanceNameTypeOverlay="accountCategories",this.contactBySystemURL="api/contacts?bySystem=true",this.render(),this.setHeaderBar(!0),this.listenForChange(),this.options.data&&this.options.data.id&&b.exists("account-detail")&&this.initSidebar("/admin/widget-groups/account-detail?account=",this.options.data.id)},initSidebar:function(a,b){this.sandbox.emit("sulu.sidebar.set-widget",a+b)},render:function(){var b,c,d;this.sandbox.once("sulu.contacts.set-defaults",this.setDefaults.bind(this)),this.sandbox.once("sulu.contacts.set-types",this.setTypes.bind(this)),this.html(this.renderTemplate("/admin/contact/template/account/form")),this.titleField=this.$find("#name"),b=this.initContactData(),c=[],this.options.data.id&&c.push({id:this.options.data.id}),d=a.get("sulucontact.components.autocomplete.default.account"),d.el="#company",d.value=b.parent?b.parent:null,d.instanceName="companyAccount"+b.id,this.sandbox.start([{name:"auto-complete@husky",options:d},{name:"input@husky",options:{el:"#vat",instanceName:"vat-input",value:b.uid?b.uid:""}}]),this.initForm(b),this.setTags(),this.bindDomEvents(),this.bindCustomEvents(),this.bindTagEvents(b)},setTags:function(){var a=this.sandbox.util.uniqueId();this.options.data.id&&(a+="-"+this.options.data.id),this.autoCompleteInstanceName+=a,this.dfdFormIsSet.then(function(){this.sandbox.start([{name:"auto-complete-list@husky",options:{el:"#tags",instanceName:this.autoCompleteInstanceName,getParameter:"search",itemsKey:"tags",remoteUrl:"/admin/api/tags?flat=true&sortBy=name&searchFields=name",completeIcon:"tag",noNewTags:!0}}])}.bind(this))},bindTagEvents:function(a){a.tags&&a.tags.length>0?(this.sandbox.on("husky.auto-complete-list."+this.autoCompleteInstanceName+".initialized",function(){this.sandbox.emit("husky.auto-complete-list."+this.autoCompleteInstanceName+".set-tags",a.tags)}.bind(this)),this.sandbox.on("husky.auto-complete-list."+this.autoCompleteInstanceName+".items-added",function(){this.dfdListenForChange.resolve()}.bind(this))):this.dfdListenForChange.resolve()},setDefaults:function(a){this.defaultTypes=a},setTypes:function(a){this.fieldTypes=a},fillFields:function(a,b,c){var d,e=-1,f=a.length;for(b>f&&(f=b);++e<f;)d=e+1>b?{}:{permanent:!0},a[e]?a[e].attributes=d:(a.push(c),a[a.length-1].attributes=d);return a},initContactData:function(){var a=this.options.data;return this.sandbox.util.foreach(d,function(b){a.hasOwnProperty(b)||(a[b]=[])}),this.fillFields(a.urls,1,{id:null,url:"",urlType:this.defaultTypes.urlType}),this.fillFields(a.emails,1,{id:null,email:"",emailType:this.defaultTypes.emailType}),this.fillFields(a.phones,1,{id:null,phone:"",phoneType:this.defaultTypes.phoneType}),this.fillFields(a.faxes,1,{id:null,fax:"",faxType:this.defaultTypes.faxType}),this.fillFields(a.notes,1,{id:null,value:""}),a},initForm:function(a){this.numberOfAddresses=a.addresses.length,this.updateAddressesAddIcon(this.numberOfAddresses),this.sandbox.on("sulu.contact-form.initialized",function(){var b=this.sandbox.form.create(this.form);b.initialized.then(function(){this.formInitializedHandler(a)}.bind(this))}.bind(this)),this.sandbox.start([{name:"contact-form@sulucontact",options:{el:"#contact-edit-form",fieldTypes:this.fieldTypes,defaultTypes:this.defaultTypes}}])},formInitializedHandler:function(a){this.setFormData(a)},setFormData:function(a){this.sandbox.emit("sulu.contact-form.add-collectionfilters",this.form),this.numberOfBankAccounts=a.bankAccounts?a.bankAccounts.length:0,this.updateBankAccountAddIcon(this.numberOfBankAccounts),this.sandbox.form.setData(this.form,a).then(function(){this.sandbox.start(this.formContactFields),this.sandbox.emit("sulu.contact-form.add-required",["email"]),this.sandbox.emit("sulu.contact-form.content-set"),this.dfdFormIsSet.resolve()}.bind(this))},updateHeadline:function(){this.sandbox.emit("sulu.header.set-title",this.sandbox.dom.val(this.titleField))},updateAddressesAddIcon:function(a){var b,c=this.sandbox.dom.find(e.addressAddId);a&&a>0&&0===c.length?(b=this.sandbox.dom.createElement(this.customTemplates.addAddressesIcon),this.sandbox.dom.after(this.sandbox.dom.find("#addresses"),b)):0===a&&c.length>0&&this.sandbox.dom.remove(this.sandbox.dom.closest(c,e.addAddressWrapper))},bindDomEvents:function(){this.sandbox.dom.keypress(this.form,function(a){13===a.which&&(a.preventDefault(),this.submit())}.bind(this))},bindCustomEvents:function(){this.sandbox.on("sulu.contact-form.added.address",function(){this.numberOfAddresses++,this.updateAddressesAddIcon(this.numberOfAddresses)},this),this.sandbox.on("sulu.contact-form.removed.address",function(){this.numberOfAddresses--,this.updateAddressesAddIcon(this.numberOfAddresses)},this),this.sandbox.on("sulu.header.toolbar.delete",function(){this.sandbox.emit("sulu.contacts.account.delete",this.options.data.id)},this),this.sandbox.on("sulu.contacts.accounts.saved",function(a){this.options.data=a,this.initContactData(),this.setFormData(a),this.setHeaderBar(!0)},this),this.sandbox.on("sulu.header.toolbar.save",function(){this.submit()},this),this.sandbox.on("sulu.header.back",function(){this.sandbox.emit("sulu.contacts.accounts.list",this.options.data)},this),this.sandbox.on("sulu.contact-form.added.bank-account",function(){this.numberOfBankAccounts++,this.updateBankAccountAddIcon(this.numberOfBankAccounts)},this),this.sandbox.on("sulu.contact-form.removed.bank-account",function(){this.numberOfBankAccounts--,this.updateBankAccountAddIcon(this.numberOfBankAccounts)},this)},copyArrayOfObjects:function(a){var b=[];return this.sandbox.util.foreach(a,function(a){b.push(this.sandbox.util.extend(!0,{},a))}.bind(this)),b},submit:function(){if(this.sandbox.form.validate(this.form)){var a=this.sandbox.form.getData(this.form);""===a.id&&delete a.id,a.tags=this.sandbox.dom.data(this.$find(e.tagsId),"tags"),this.updateHeadline(),a.parent={id:this.sandbox.dom.attr("#company input","data-id")},this.sandbox.emit("sulu.contacts.accounts.save",a)}},setHeaderBar:function(a){if(a!==this.saved){var b=this.options.data&&this.options.data.id?"edit":"add";this.sandbox.emit("sulu.header.toolbar.state.change",b,a,!0)}this.saved=a},listenForChange:function(){this.dfdListenForChange.then(function(){this.sandbox.dom.on("#contact-form","change",function(){this.setHeaderBar(!1)}.bind(this),".changeListener select, .changeListener input, .changeListener textarea"),this.sandbox.dom.on("#contact-form","keyup",function(){this.setHeaderBar(!1)}.bind(this),".changeListener select, .changeListener input, .changeListener textarea"),this.sandbox.on("sulu.contact-form.changed",function(){this.setHeaderBar(!1)}.bind(this))}.bind(this))},updateBankAccountAddIcon:function(a){var b,c=this.sandbox.dom.find(e.bankAccountAddSelector,this.$el);a&&a>0&&0===c.length?(b=this.sandbox.dom.createElement(f.addBankAccountsIcon),this.sandbox.dom.after(this.sandbox.dom.find(e.bankAccountsId),b)):0===a&&c.length>0&&this.sandbox.dom.remove(this.sandbox.dom.closest(c,e.addBankAccountsWrapper))}}});
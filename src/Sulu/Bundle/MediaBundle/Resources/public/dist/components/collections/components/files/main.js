define(function(){"use strict";var a={data:{},instanceName:"collection"},b={table:{itemId:"table",name:"table"},thumbnailSmall:{itemId:"small-thumbnails",name:"thumbnail",thViewOptions:{large:!1}},thumbnailLarge:{itemId:"big-thumbnails",name:"thumbnail",thViewOptions:{large:!0}}},c={dropzoneSelector:".dropzone-container",toolbarSelector:".list-toolbar-container",datagridSelector:".datagrid-container",moveSelector:".move-container",listViewStorageKey:"collectionEditListView"};return{view:!0,layout:{navigation:{collapsed:!0},content:{width:"max"}},templates:["/admin/media/template/collection/files"],initialize:function(){this.options=this.sandbox.util.extend(!0,{},a,this.options);var b="/admin/api/collections/"+this.options.data.id+"?depth=1";this.sandbox.emit("husky.navigation.select-id","collections-edit",{dataNavigation:{url:b}}),this.listView=this.sandbox.sulu.getUserSetting(c.listViewStorageKey)||"thumbnailSmall",this.bindCustomEvents(),this.render()},remove:function(){this.sandbox.stop(c.dropzoneSelector)},bindCustomEvents:function(){this.sandbox.on("sulu.list-toolbar.change.table",function(){this.sandbox.emit("husky.datagrid.view.change","table"),this.sandbox.sulu.saveUserSetting(c.listViewStorageKey,"table")}.bind(this)),this.sandbox.on("sulu.list-toolbar.change.thumbnail-small",function(){this.sandbox.emit("husky.datagrid.view.change","thumbnail",{large:!1}),this.sandbox.sulu.saveUserSetting(c.listViewStorageKey,"thumbnailSmall")}.bind(this)),this.sandbox.on("sulu.list-toolbar.change.thumbnail-large",function(){this.sandbox.emit("husky.datagrid.view.change","thumbnail",{large:!0}),this.sandbox.sulu.saveUserSetting(c.listViewStorageKey,"thumbnailLarge")}.bind(this)),this.sandbox.on("sulu.header.back",function(){this.sandbox.emit("sulu.media.collections.list")}.bind(this)),this.sandbox.on("husky.dropzone."+this.options.instanceName+".files-added",function(a){this.sandbox.emit("sulu.labels.success.show","labels.success.media-upload-desc","labels.success"),this.addFilesToDatagrid(a)}.bind(this)),this.sandbox.on("sulu.list-toolbar.add",function(){this.sandbox.emit("husky.dropzone."+this.options.instanceName+".open-data-source")}.bind(this)),this.sandbox.on("husky.toolbar."+this.options.instanceName+".initialized",function(){this.sandbox.emit("sulu.header.toolbar.item.mark",b[this.listView].itemId)}.bind(this)),this.sandbox.on("husky.datagrid.item.click",this.editMedia.bind(this)),this.sandbox.on("husky.datagrid.download-clicked",this.download.bind(this)),this.sandbox.on("sulu.media-edit.closed",function(){this.sandbox.emit("husky.dropzone."+this.options.instanceName+".unlock-popup")}.bind(this)),this.sandbox.on("sulu.media.collections.save-media",this.updateGrid.bind(this)),this.sandbox.on("sulu.list-toolbar.delete",this.deleteMedia.bind(this)),this.sandbox.on("husky.datagrid.number.selections",this.toggleEditButton.bind(this)),this.sandbox.on("sulu.list-toolbar.edit",this.editMedia.bind(this)),this.sandbox.on("sulu.media.collection-select.move-media.selected",this.moveMedia.bind(this)),this.sandbox.on("sulu.header.toolbar.language-changed",this.changeLanguage.bind(this))},changeLanguage:function(a){this.sandbox.emit("sulu.header.toolbar.item.loading","language"),this.sandbox.emit("sulu.media.collections.reload-collection",this.options.data.id,{locale:a.id,breadcrumb:"true"},function(a){this.options.data=a,this.setHeaderInfos(),this.sandbox.emit("sulu.header.toolbar.item.enable","language",!1)}.bind(this)),this.sandbox.emit("sulu.media.collections-edit.set-locale",a.id)},updateGrid:function(a){var b=!1;a.locale&&a.locale===this.options.locale?b=!0:a.length>0&&a[0].locale===this.options.locale&&(b=!0),b===!0&&this.sandbox.emit("husky.datagrid.records.change",a)},download:function(a){this.sandbox.emit("sulu.media.collections.download-media",a)},deleteMedia:function(){this.sandbox.emit("husky.datagrid.items.get-selected",function(a){this.sandbox.emit("sulu.media.collections.delete-media",a,function(){this.sandbox.emit("husky.datagrid.medium-loader.show")}.bind(this),function(a,b){b===!0&&this.sandbox.emit("husky.datagrid.medium-loader.hide"),this.sandbox.emit("husky.datagrid.record.remove",a),this.sandbox.emit("husky.data-navigation.collections.reload")}.bind(this))}.bind(this))},render:function(){this.setHeaderInfos(),this.sandbox.dom.html(this.$el,this.renderTemplate("/admin/media/template/collection/files")),this.startDropzone(),this.startDatagrid(),this.renderSelectCollection()},editMedia:function(a){this.sandbox.emit("sulu.header.toolbar.item.loading","edit"),this.sandbox.once("sulu.media-edit.edit",function(){this.sandbox.emit("sulu.header.toolbar.item.enable","edit",!1)}.bind(this)),this.sandbox.emit("husky.datagrid.items.get-selected",function(b){this.sandbox.emit("husky.dropzone."+this.options.instanceName+".lock-popup"),a&&-1===b.indexOf(a)&&b.push(a),this.sandbox.emit("sulu.media.collections.edit-media",b)}.bind(this))},setHeaderInfos:function(){var a,b,c=[{title:"navigation.media"},{title:"media.collections.title",event:"sulu.media.collections.breadcrumb-navigate.root"}],d=this.options.data._embedded.breadcrumb||[];for(a=0,b=d.length;b>a;a++)c.push({title:d[a].title,event:"sulu.media.collections.breadcrumb-navigate",eventArgs:d[a]});c.push({title:this.options.data.title}),this.sandbox.emit("sulu.header.set-title",this.options.data.title),this.sandbox.emit("sulu.header.set-breadcrumb",c)},startDropzone:function(){this.sandbox.start([{name:"dropzone@husky",options:{el:this.$find(c.dropzoneSelector),url:"/admin/api/media?collection="+this.options.data.id,method:"POST",paramName:"fileVersion",instanceName:this.options.instanceName}}])},renderSelectCollection:function(){this.sandbox.start([{name:"collections/components/collection-select@sulumedia",options:{el:this.$find(c.moveSelector),instanceName:"move-media",title:this.sandbox.translate("sulu.media.move.overlay-title"),disableIds:[this.options.data.id]}}])},startMoveMediaOverlay:function(){this.sandbox.emit("husky.datagrid.items.get-selected",function(a){this.selectedIds=a,this.sandbox.emit("sulu.media.collection-select.move-media.open")}.bind(this))},moveMedia:function(a){var b=this.selectedIds.length;this.sandbox.emit("sulu.media.collections.move-media",this.selectedIds,a,function(a){this.sandbox.emit("husky.datagrid.record.remove",a),b--,0===b&&this.sandbox.emit("sulu.labels.success.show","labels.success.media-move-desc","labels.success")}.bind(this)),this.sandbox.emit("sulu.media.collection-select.move-media.close")},startDatagrid:function(){this.sandbox.sulu.initListToolbarAndList.call(this,"media","/admin/api/media/fields",{el:this.$find(c.toolbarSelector),instanceName:this.options.instanceName,parentTemplate:"defaultEditable",template:[{id:"settings",icon:"gear",position:30,items:[{id:"media-move",title:this.sandbox.translate("sulu.media.move"),callback:function(){this.startMoveMediaOverlay()}.bind(this)},{type:"columnOptions"}]},{id:"change",icon:"th-large",itemsOption:{markable:!0},items:[{id:"small-thumbnails",title:this.sandbox.translate("sulu.list-toolbar.small-thumbnails"),callback:function(){this.sandbox.emit("sulu.list-toolbar.change.thumbnail-small")}.bind(this)},{id:"big-thumbnails",title:this.sandbox.translate("sulu.list-toolbar.big-thumbnails"),callback:function(){this.sandbox.emit("sulu.list-toolbar.change.thumbnail-large")}.bind(this)},{id:"table",title:this.sandbox.translate("sulu.list-toolbar.table"),callback:function(){this.sandbox.emit("sulu.list-toolbar.change.table")}.bind(this)}]}],inHeader:!1},{el:this.$find(c.datagridSelector),url:"/admin/api/media?collection="+this.options.data.id,view:b[this.listView].name,resultKey:"media",viewOptions:{table:{fullWidth:!1,rowClickSelect:!0},thumbnail:b[this.listView].thViewOptions||{}}})},toggleEditButton:function(a){var b=a>0;this.sandbox.emit("sulu.list-toolbar."+this.options.instanceName+".edit.state-change",b),this.sandbox.emit("husky.toolbar."+this.options.instanceName+".item."+(b?"enable":"disable"),"media-move",!1)},addFilesToDatagrid:function(a){for(var b=-1,c=a.length;++b<c;)a[b].selected=!0;this.sandbox.emit("husky.datagrid.records.add",a,this.scrollToBottom.bind(this)),this.sandbox.emit("husky.data-navigation.collections.reload")},scrollToBottom:function(){this.sandbox.dom.scrollAnimate(this.sandbox.dom.height(this.sandbox.dom.$document),"body")}}});
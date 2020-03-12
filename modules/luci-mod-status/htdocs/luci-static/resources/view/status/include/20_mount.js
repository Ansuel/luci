'use strict';
'require fs';
'require rpc';

var callMountPoints;

callMountPoints = rpc.declare({
	object: 'luci',
	method: 'getMountPoints',
	expect: { result: [] }
});

return L.Class.extend({
	title: _('Mount Points'),
	
	load: function() {
		return Promise.all([
			callMountPoints()
		]);
	},

	render: function(data) {

		var mounts = data[0] || [];

		if (!L.hasSystemFeature('block'))
			return null;

		var table = E('div', { 'class': 'table' }, [
			E('div', { 'class': 'tr table-titles' }, [
				E('div', { 'class': 'th' }, _('Device')),
				E('div', { 'class': 'th' }, _('Mount Point')),
				E('div', { 'class': 'th' }, _('Available') + ' / ' + _('Size'))
			])
		]);

		cbi_update_table(table, mounts.filter( function(mount) {
				return mount.device.match('/dev/sd*') || 
					mount.mount.match('/overlay') 
			}).map(function(element) {
				return [
					element.device,
					element.mount,
					'%1024.2mB / %1024.2mB'.format(element.avail, element.size)
				];
			}), E('em', _('There is no service configured.')));

		return table;
	}
});

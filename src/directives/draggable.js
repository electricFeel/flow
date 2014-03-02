define(['angular'], function(ng){
	return{
		name: 'draggable',
		sig: function(){
			return function(scope, element){
				var el = element[0];
				el.draggable = true;

				el.addEventListener('dragstart', function(e){
					e.dataTransfer.effectAllowed = 'move';
					e.dataTransfer.setData('Text', this.id);
					this.classList.add('drag');
				}, 
				false);
			}
		}
	}
});
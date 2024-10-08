export const sample = `
startshape WELCOME

shape WELCOME
{
	MESSAGE [ hue 225 sat 0.7 b 0.6 ]
	VINEL [ sat 1 hue 120
		x 3 y -55
		r 0 b 0.5 s 10
	]
	VINEL [ flip 90
		sat 1 hue 120
		x 85 y -55
		r 0 b 0.5 s 10
	]
}

shape MESSAGE
{
	W [ x 0 ]
	E [ x 12 ]
	L [ x 24 ]
	C [ x 34 ]
	O [ x 46 ]
	M [ x 64 ]
	E [ x 80 ]
}

shape W
{
	LINE [ r -7 ]
	LINE [ r 7 ]
	LINE [ x 6 r -7 ]
	LINE [ x 6 r 7 ]
}

shape E
{
	LINE [ s 0.9 ]
	LINE [ s 0.9 -1 y 24 ]
	LINE [ s 0.4 r -90 y 0 ]
	LINE [ s 0.4 r -90 y 12 ]
	LINE [ s 0.4 r -90 y 24 ]
}

shape L
{
	LINE [ ]
	LINE [ s 0.4 x 0.4 r -90 y 0 ]
}

shape C
{
	ARCL [ y 12 flip 90 ]
	ARCL [ y 12 r 180 ]
}

shape O
{
	ARCL [ y 12 flip 90]
	ARCL [ y 12 r 180 ]
	ARCL [ y 12 x 14 r 180 flip 90]
	ARCL [ y 12 x 14 ]
}

shape M
{
	LINE [ y 24 r 180 ]
	LINE [ y 24 r  -160 s 0.75 ]
	LINE [ y 24 x 12 r 160 s 0.75 ]
	LINE [ y 24 x 12 r 180 ]
}

shape LINE
{
	TRIANGLE [[ s 1 30 y 0.26 ]]
	//MARK { }
	//LINE { size 0.98 y 0.5 }
}

shape ARCL
{
	MARK [ ]
	ARCL [ size 0.97 y 0.55 r 1.5 ]
}

shape MARK
{
	SQUARE [ ]
}


shape VINEL
{
	STEML [ ]
	STEML [ x 1 r 5 flip 0 ]
	VINEL [ x 2 size 0.9 r 10 ]
}

shape STEML
{
	GOL [ r 20 s 0.1 ]
	END [ s 0.2 r 120 hue 150
		x 1.3 y -0.6 b -0.3]
}
shape GOL
{
	CIRCLE [ ]
	GOL [ x 0.3 r -1 s 0.985 ]
}


shape END
{
	CIRCLE [ x -0.5 y 0.0 s 1.0 ]
	CIRCLE [ x 0.45 y 0.6 s 0.9 ]
	CIRCLE [ x -0.4 y 1.2 s 0.8 ]
	CIRCLE [ x 0.35 y 1.8 s 0.7 ]
	CIRCLE [ x -0.3 y 2.4 s 0.6 ]
}
`;


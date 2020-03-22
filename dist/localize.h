#if LANG_DE
	#include "../de-txts.h"
#elif LANG_EN
	#include "../en-txts.h"
#else
	#error "no lang"
#endif
#define _AS_STRING(X) #X
#define AS_STRING(X) _AS_STRING(X)
#include AS_STRING(../FILE)
